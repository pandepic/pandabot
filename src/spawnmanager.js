var globals = require('globals');

module.exports.spawnCreep = function (spawnPoint, creep, memory) {
    if (spawnPoint.energy < creep.cost) {
        return false;
    }

    if (globals.isSpawnReserved(spawnPoint) == false) {
        globals.reserveSpawn(spawnPoint);
        
        memory.role = creep.role;
        memory.class = creep.class;

        var nameIndex = 1;
        var name = creep.role + '_' + nameIndex;

        while (Game.creeps[name] != null) {
            nameIndex += 1;
            name = creep.role + '_' + nameIndex;
        }

        spawnPoint.createCreep(creep.body, name, memory);

        return name;

    } else {
        return false;
    }
};
