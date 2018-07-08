var globals = require('globals');

module.exports = {

    run: function (creep) {
        
        if (creep.carry.energy == 0) {
            var target = Game.creeps[creep.memory.target];

            if (target == null) {
                creep.memory.target = 'MISSING';
                creep.say('😥');
                return;
            }

            if (target.transfer(creep, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                creep.moveTo(target);
            } else {
                creep.say('🔄');
            }

        } else {
            var container = Game.spawns[creep.memory.origin];

            if (container.energy == container.energyCapacity) {
                container = creep.pos.findClosestByPath(FIND_STRUCTURES, {
                    filter: object => object.structureType == STRUCTURE_CONTAINER && object.store[RESOURCE_ENERGY] < object.storeCapacity
                });
            }

            if (container == null) {
                return;
            }

            if (creep.transfer(container, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                creep.moveTo(container);
            } else {
                creep.say('🔄');
            }
        }

    }
        
};

module.exports.BasicCollector = function () {
    this.body = [WORK, MOVE, MOVE, CARRY];
    this.cost = globals.getEnergyCost(this.body);
    this.class = 'basic_collector';
    this.role = 'collector';
};
