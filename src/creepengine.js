var globals = require('globals');

var harvester = require('creeps_harvester');
var upgrader = require('creeps_upgrader');
var collector = require('creeps_collector');
var builder = require('creeps_builder');
var upgradeSupplier = require('creeps_upgradesupplier');
var salvager = require('creeps_salvager');

module.exports = {
    
    run: function () {

        for (var name in Game.creeps) {
            var creep = Game.creeps[name];

            if (creep.memory.role == 'upgrader') {
                upgrader.run(creep);
            } else if (creep.memory.role == 'harvester') {
                harvester.run(creep);
            } else if (creep.memory.role == 'collector') {
                collector.run(creep);
            } else if (creep.memory.role == 'builder') {
                builder.run(creep);
            } else if (creep.memory.role == 'upgradesupplier') {
                upgradeSupplier.run(creep);
            } else if (creep.memory.role == 'salvager') {
                salvager.run(creep);
            }

        }

    }

};
