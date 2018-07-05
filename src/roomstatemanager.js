var globals = require('globals');
var spawnManager = require('spawnmanager');

var harvester = require('creeps_harvester');
var upgrader = require('creeps_upgrader');
var collector = require('creeps_collector');
var builder = require('creeps_builder');

module.exports = {
    
    run: function () {
        
        handleEnergyHarvesting();
        handleRoads();
        handleBuilders();

    }

};

function handleRoads() {
    for (var name in Game.spawns) {
        var spawn = Game.spawns[name];

        var energySources = spawn.room.find(FIND_SOURCES);

        energySources.forEach(source => {

            var closestSite = source.pos.findClosestByPath(FIND_MY_CONSTRUCTION_SITES, {
                filter: object => object.structureType == STRUCTURE_ROAD
            });

            var closestRoad = source.pos.findClosestByPath(FIND_STRUCTURES, {
                filter: object => object.structureType == STRUCTURE_ROAD
            });

            var needsRoad = true;;

            if (closestSite != null) {
                if (source.pos.getRangeTo(closestSite) == 1) {
                    needsRoad = false;
                }
            }
            
            if (closestRoad != null) {
                if (source.pos.getRangeTo(closestRoad) == 1) {
                    needsRoad = false;
                }
            }

            if (needsRoad) {
                var path = spawn.pos.findPathTo(source.pos, {
                    ignoreCreeps: true,
                });
    
                path.forEach(p => {
                    var pos = new RoomPosition(p.x, p.y, spawn.pos.roomName);
                    pos.createConstructionSite(STRUCTURE_ROAD);
                });
            }
        });

        var controller = spawn.room.controller;

        if (controller != null) {
            var needsRoad = true;

            var closestSite = controller.pos.findClosestByPath(FIND_MY_CONSTRUCTION_SITES, {
                filter: object => object.structureType == STRUCTURE_ROAD
            });

            var closestRoad = controller.pos.findClosestByPath(FIND_STRUCTURES, {
                filter: object => object.structureType == STRUCTURE_ROAD
            });

            if (closestSite != null) {
                if (controller.pos.getRangeTo(closestSite) == 1) {
                    needsRoad = false;
                }
            }
            
            if (closestRoad != null) {
                if (controller.pos.getRangeTo(closestRoad) == 1) {
                    needsRoad = false;
                }
            }

            if (needsRoad) {
                var path = spawn.pos.findPathTo(controller.pos, {
                    ignoreCreeps: true,
                });
    
                path.forEach(p => {
                    var pos = new RoomPosition(p.x, p.y, spawn.pos.roomName);
                    pos.createConstructionSite(STRUCTURE_ROAD);
                });
            }
        }
        
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
                if (existingHarvester.memory.desiredCollectors == null) {
                    var path = spawn.pos.findPathTo(existingHarvester.pos, {
                        ignoreCreeps: true,
                    });

                    if (path != null && path.length > 0) {
                        existingHarvester.memory.desiredCollectors = 1 + parseInt(path.length / 10);
                    } else {
                        existingHarvester.memory.desiredCollectors = 1;
                    }
                }

                var collectorCount = 0;

                for (var name in Game.creeps) {
                    var creep = Game.creeps[name];
                    if (creep.memory.role == 'collector') {
                        if (creep.memory.target == existingHarvester.name) {
                            collectorCount += 1;
                        }
                    }
                }

                existingHarvester.memory.currentCollectors = collectorCount;

                if (collectorCount < parseInt(existingHarvester.memory.desiredCollectors)) {
                    for (var name in Game.creeps) {
                        var creep = Game.creeps[name];
                        if (creep.memory.role == 'collector') {
                            if (creep.memory.target == 'MISSING') {
                                creep.memory.target = existingHarvester.name;
                                existingHarvester.memory.collector = creep.name;
                                existingHarvester.say('⭐');
                                collectorCount += 1;
                            }
                        }
                    }

                    if (collectorCount < parseInt(existingHarvester.memory.desiredCollectors)) {
                        var newCreep = new collector.BasicCollector();
                    
                        var newName = spawnManager.spawnCreep(spawn, newCreep, {
                            origin: spawn.name,
                            target: existingHarvester.name,
                        });

                        if (newName != false) {
                            existingHarvester.say('⭐');
                            existingHarvester.memory.collector = newName;
                            collectorCount += 1;
                        }
                    }
                }

            }
        } // check energy sources
    }
}