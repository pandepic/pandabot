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
            var spawn = Game.spawns[creep.memory.origin];

            if (creep.transfer(spawn, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                creep.moveTo(spawn);
            } else {
                creep.say('🔄');
            }
        }

    }
        
};

module.exports.BasicBuilder = function () {
    this.body = [WORK, MOVE, MOVE, CARRY];
    this.cost = globals.getEnergyCost(this.body);
    this.class = 'basic_builder';
    this.role = 'builder';
};
