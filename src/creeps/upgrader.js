var globals = require('globals');

module.exports = {

    run: function (creep) {
        
        var spawn = Game.spawns[creep.memory.creator];

        if(creep.upgradeController(spawn.room.controller) == ERR_NOT_IN_RANGE) {
            creep.moveTo(spawn.room.controller);
        }

    }

};

module.exports.BasicUpgrader = function() {
    this.body = [WORK, WORK, MOVE, CARRY];
    this.cost = globals.getEnergyCost(this.body);
    this.class = 'basic_upgrader';
    this.role = 'upgrader';
};
