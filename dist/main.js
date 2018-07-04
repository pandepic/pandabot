var roomStateManager = require('roomstatemanager');
var creepEngine = require('creepengine');

module.exports.loop = function() {
    
    roomStateManager.run();
    creepEngine.run();
    
}
