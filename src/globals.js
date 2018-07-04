module.exports.spawnReserved = [];
module.exports.maxBodySize = 50;

module.exports.isSpawnReserved = function (spawnPoint) {
    for (var i in this.spawnReserved) {
        if (this.spawnReserved[i] == spawnPoint.name) {
            return true;
        }
    }

    return false;
};

module.exports.reserveSpawn = function (spawnPoint) {
    var alreadyReserved = false;
    
    for (var i in this.spawnReserved) {
        if (this.spawnReserved[i] == spawnPoint.name) {
            alreadyReserved = true;
        }
    }

    if (alreadyReserved == false) {
        this.spawnReserved.push(spawnPoint.name);
    }
};

module.exports.getEnergyCost = function (body) {
    var cost = 0;

    for (var i in body) {
        var part = body[i];

        if (part == MOVE) {
            cost += 50;
        } else if (part == WORK) {
            cost += 100;
        } else if (part == CARRY) {
            cost += 50;
        } else if (part == ATTACK) {
            cost += 80;
        } else if (part == RANGED_ATTACK) {
            cost += 150;
        } else if (part == HEAL) {
            cost += 250;
        } else if (part == CLAIM) {
            cost += 600;
        } else if (part == TOUGH) {
            cost += 10;
        }
    }

    return cost;
};
