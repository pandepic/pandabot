var globals = require('globals');

module.exports = {

    run: function (creep) {

        if (creep.carry.energy < creep.carryCapacity) {
            var sources = creep.room.find(FIND_SOURCES);

            for (var i in sources) {
                if (sources[i].id == creep.memory.source) {
                    if (creep.harvest(sources[i]) == ERR_NOT_IN_RANGE) {
                        creep.moveTo(sources[i]);
                    }
                }
            }

        } else if (creep.carry.energy == creep.carryCapacity) {
            //
        }

    }
        
};

module.exports.BasicHarvester = function () {
    this.body = [WORK, WORK, MOVE, CARRY];
    this.cost = globals.getEnergyCost(this.body);
    this.class = 'basic_harvester';
    this.role = 'harvester';
};
