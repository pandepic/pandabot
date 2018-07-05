var globals = require('globals');

module.exports = {

    run: function (creep) {
        if (creep.memory.targetSource == null) {
            creep.memory.targetSource = 'N/A';
        }

        if (creep.memory.mode == null) {
            creep.memory.mode = 'harvest';
        }

        if (creep.memory.targetSite == null) {
            creep.memory.targetSite = 'N/A';
        }

        if (creep.memory.targetStructure == null) {
            creep.memory.targetStructure = 'N/A';
        }

        if (creep.memory.mode == 'harvest') {
            if (creep.memory.targetSource == 'N/A') {
                var closestSource = creep.pos.findClosestByPath(FIND_SOURCES_ACTIVE);

                if (closestSource != null) {
                    creep.memory.targetSource = closestSource.id;
                    creep.say('➡️');
                }
            } else {
                var targetSource = Game.getObjectById(creep.memory.targetSource);

                if (targetSource != null) {
                    if (creep.harvest(targetSource) == ERR_NOT_IN_RANGE) {
                        creep.moveTo(targetSource);
                    }

                    if (creep.carry.energy == creep.carryCapacity) {
                        creep.memory.mode = 'build';
                        creep.memory.targetSource = 'N/A';
                        creep.say('⚒️');
                        return;
                    }
                }
            }

        } else if (creep.memory.mode == 'build') {
            if (creep.carry.energy == 0) {
                creep.memory.mode = 'harvest';
                creep.memory.targetSite = 'N/A';
                creep.say('⛏️');
                return;
            }

            if (creep.memory.targetSite == 'N/A') {
                var site = creep.pos.findClosestByPath(FIND_MY_CONSTRUCTION_SITES);

                if (site != null) {
                    creep.memory.targetSite = site.id;
                } else {
                    creep.memory.mode = 'repair';
                    creep.memory.targetSite = 'N/A';
                    creep.say('🛠️');
                    return;
                }
            } else {
                var targetSite = Game.getObjectById(creep.memory.targetSite);
                var buildResult = creep.build(targetSite);

                if (buildResult == ERR_NOT_IN_RANGE) {
                    creep.moveTo(targetSite);
                } else if (buildResult != OK) {
                    creep.memory.mode = 'harvest';
                    creep.memory.targetSite = 'N/A';
                    creep.say('⛏️');
                    return;
                }
            }
        } else if (creep.memory.mode == 'repair') {
            if (creep.carry.energy == 0) {
                creep.memory.mode = 'harvest';
                creep.memory.targetStructure = 'N/A';
                creep.say('⛏️');
                return;
            }

            if (creep.memory.targetStructure == 'N/A') {
                var damagedStructure = creep.pos.findClosestByPath(FIND_STRUCTURES, {
                    filter: object => object.hits < object.hitsMax
                });

                if (damagedStructure != null) {
                    creep.memory.targetStructure = damagedStructure.id;
                }
            } else {
                var targetStructure = Game.getObjectById(creep.memory.targetStructure);
                var repairResult = creep.repair(targetStructure);

                if (repairResult == ERR_NOT_IN_RANGE) {
                    creep.moveTo(targetStructure);
                } else if (repairResult != OK) {
                    creep.memory.mode = 'harvest';
                    creep.memory.targetStructure = 'N/A';
                    creep.say('⛏️');
                    return;
                } else if (targetStructure.hits == targetStructure.hitsMax) {
                    creep.memory.mode = 'harvest';
                    creep.memory.targetStructure = 'N/A';
                    creep.say('⛏️');
                    return;
                }
            }
        }

    }
        
};

module.exports.BasicBuilder = function () {
    this.body = [MOVE, WORK, WORK, CARRY];
    this.cost = globals.getEnergyCost(this.body);
    this.class = 'basic_builder';
    this.role = 'builder';
};
