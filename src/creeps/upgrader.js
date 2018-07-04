var globals = require('globals');

module.exports = {

    run: function (creep) {

        /* if(creep.carry.energy == 0) {
            var sources = creep.room.find(FIND_SOURCES);
            if(creep.harvest(sources[0]) == ERR_NOT_IN_RANGE) {
                creep.moveTo(sources[0]);
            }
        }
        else {
            if(creep.upgradeController(creep.room.controller) == ERR_NOT_IN_RANGE) {
                creep.moveTo(creep.room.controller);
            }
        } */

    }

};

module.exports.BasicUpgrader = function() {
    this.body = [WORK, MOVE, CARRY];
    this.cost = globals.getEnergyCost(this.body);
    this.class = 'basic_upgrader';
    this.role = 'upgrader';
};
