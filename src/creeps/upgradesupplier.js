var globals = require('globals');

module.exports = {

    run: function (creep) {
        
    }
        
};

module.exports.BasicUpgradeSupplier = function () {
    this.body = [WORK, MOVE, MOVE, CARRY];
    this.cost = globals.getEnergyCost(this.body);
    this.class = 'basic_upgradesupplier';
    this.role = 'upgradesupplier';
};
