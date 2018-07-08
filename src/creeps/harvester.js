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
            var collectorCount = 0; // if harvesters have no collectors they deliver energy back themselves

            for (var name in Game.creeps) {
                var c = Game.creeps[name];
                if (c.memory.role == 'collector') {
                    if (c.memory.target == creep.name) {
                        collectorCount += 1;
                    }
                }
            }

            if (collectorCount == 0) {
                var closestSpawn = creep.pos.findClosestByPath(FIND_MY_SPAWNS);

                if (creep.transfer(closestSpawn, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(closestSpawn);
                } else {
                    creep.say('🔄');
                }
            }
        }

    }
        
};

module.exports.BasicHarvester = function () {
    this.body = [WORK, WORK, MOVE, CARRY];
    this.cost = globals.getEnergyCost(this.body);
    this.class = 'basic_harvester';
    this.role = 'harvester';
};
