var globals = require('globals');

module.exports = {

    run: function (creep) {
        if (creep.carry.energy < 20) {
            var spawn = Game.spawns[creep.memory.origin];

            if (creep.withdraw(spawn, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                creep.moveTo(spawn);
            } else {
                creep.say('🔄');
            }

        } else {
            var target = Game.creeps[creep.memory.target];

            if (target == null) {
                creep.memory.target = 'MISSING';
                creep.say('😥');
                return;
            }

            if (creep.transfer(target, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                creep.moveTo(target);
            } else {
                creep.say('🔄');
            }

        }

    }
        
};

module.exports.BasicUpgradeSupplier = function () {
    this.body = [WORK, MOVE, MOVE, CARRY];
    this.cost = globals.getEnergyCost(this.body);
    this.class = 'basic_upgradesupplier';
    this.role = 'upgradesupplier';
};
