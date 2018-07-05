var globals = require('globals');
var spawnManager = require('spawnmanager');

var harvester = require('creeps_harvester');
var upgrader = require('creeps_upgrader');
var collector = require('creeps_collector');
var builder = require('creeps_builder');
var upgradeSupplier = require('creeps_upgradesupplier');
var salvager = require('creeps_salvager');

module.exports = {
    
    run: function () {
        
        handleEnergyHarvesting();
        handleRoads();
        handleBuilders();
        handleUpgraders();

    }

};

function handleUpgraders() {
    for (var name in Game.spawns) {
        var spawn = Game.spawns[name];
        var upgraderCount = 0;

        for (var name in Game.creeps) {
            var creep = Game.creeps[name];

            if (creep.memory.role == 'upgrader') {
                if (creep.memory.creator == spawn.name) {
                    upgraderCount += 1;

                    if (creep.memory.supplier == null || Game.creeps[creep.memory.supplier] == null) {
                        var newCreep = new upgradeSupplier.BasicUpgradeSupplier();
                    
                        var newName = spawnManager.spawnCreep(spawn, newCreep, {
                            origin: spawn.name,
                            target: creep.name,
                        });

                        if (newName != false) {
                            creep.say('⭐');
                            creep.memory.supplier = newName;
                        }
                    }
                }
            }

        }

        if (upgraderCount < 1) {
            var newCreep = new upgrader.BasicUpgrader();

            var newName = spawnManager.spawnCreep(spawn, newCreep, {
                creator: spawn.name,
            });
        }
    }
}

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

        var desiredBuilders = 2;

        var site = spawn.pos.findClosestByPath(FIND_MY_CONSTRUCTION_SITES);
        if (site != null) {
            desiredBuilders = 5;
        }

        if (builderCount < desiredBuilders) {
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
            var sourceHarvesterCount = 0;
            var existingHarvester = null;

            for (var name in Game.creeps) {
                var creep = Game.creeps[name];
                if (creep.memory.role == 'harvester') {
                    if (creep.memory.source == source.id) {
                        sourceHarvesterCount += 1;
                        existingHarvester = creep;
                    }
                }
            }

            if (sourceHarvesterCount < 2) {
                var newCreep = new harvester.BasicHarvester();
                
                var newName = spawnManager.spawnCreep(spawn, newCreep, {
                    source: source.id,
                });
                
            } else { // do any harvesters need a collector?
                for (var n in Game.creeps) {
                    var c = Game.creeps[n];
                    if (c.memory.role == 'harvester') {
                        if (c.memory.source == source.id) {
                            var existingHarvester = c;

                            var path = spawn.pos.findPathTo(existingHarvester.pos, {
                                ignoreCreeps: true,
                            });
            
                            if (path != null && path.length > 0) {
                                existingHarvester.memory.desiredCollectors = 1 + parseInt(path.length / 10);
                            } else {
                                existingHarvester.memory.desiredCollectors = 1;
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
                    }
                }

            } // do any harvesters need a collector?
        } // check energy sources
    }
}