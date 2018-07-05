var globals = require('globals');
var spawnManager = require('spawnmanager');

var harvester = require('creeps_harvester');
var upgrader = require('creeps_upgrader');
var collector = require('creeps_collector');
var builder = require('creeps_builder');

module.exports = {
    
    run: function () {
        
        handleEnergyHarvesting();
        //handleRoads();
        handleBuilders();

    }

};

function handleRoads() {
    for (var name in Game.spawns) {
        var spawn = Game.spawns[name];

        var energySources = spawn.room.find(FIND_SOURCES);

        energySources.forEach(source => {
            var path = spawn.pos.findPathTo(source.pos, {
                ignoreCreeps: true,
            });

            path.forEach(p => {
                var pos = new RoomPosition(p.x, p.y, spawn.pos.roomName);
                pos.createConstructionSite(STRUCTURE_ROAD);
            });
        });
    }
}

function handleBuilders() {
    for (var name in Game.spawns) {
        var spawn = Game.spawns[name];
        var builderCount = 0;

        for (var name in Game.creeps) {
            var creep = Game.creeps[name];

            if (creep.memory.role == 'builder') {
                if (creep.memory.creator == spawn.name) {
                    builderCount += 1;
                }
            }
        }

        if (builderCount < 5) {
            var newCreep = new builder.BasicBuilder();

            var newName = spawnManager.spawnCreep(spawn, newCreep, {
                creator: spawn.name,
            });
        }
    }
}

function handleEnergyHarvesting() {
    for (var name in Game.spawns) {
        var spawn = Game.spawns[name];

        var energySources = spawn.room.find(FIND_SOURCES);

        for (var i in energySources) {
            var source = energySources[i];
            var sourceNeedsHarvester = true;
            var existingHarvester = null;

            for (var name in Game.creeps) {
                var creep = Game.creeps[name];
                if (creep.memory.role == 'harvester') {
                    if (creep.memory.source == source.id) {
                        sourceNeedsHarvester = false;
                        existingHarvester = creep;
                    }
                }
            }

            if (sourceNeedsHarvester) {
                var newCreep = new harvester.BasicHarvester();
                
                var newName = spawnManager.spawnCreep(spawn, newCreep, {
                    source: source.id,
                });
                
            } else { // does the harvester need a collector?
                if (existingHarvester.memory.collector == null || Game.creeps[existingHarvester.memory.collector] == null) {
                    var needsNewCollector = true;

                    // look for existing collectors without a target
                    for (var name in Game.creeps) {
                        var creep = Game.creeps[name];
                        if (creep.memory.role == 'collector') {
                            if (creep.memory.target == 'MISSING') {
                                needsNewCollector = false;
                                creep.memory.target = existingHarvester.name;
                                existingHarvester.memory.collector = creep.name;
                                existingHarvester.say('⭐');
                            }
                        }
                    }

                    if (needsNewCollector) {
                        var newCreep = new collector.BasicCollector();
                    
                        var newName = spawnManager.spawnCreep(spawn, newCreep, {
                            origin: spawn.name,
                            target: existingHarvester.name,
                        });

                        if (newName != false) {
                            existingHarvester.say('⭐');
                            existingHarvester.memory.collector = newName;
                        }
                    }
                }
            }
        } // check energy sources
    }
}