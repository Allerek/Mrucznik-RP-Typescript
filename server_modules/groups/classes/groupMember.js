const { getPlayerById } = require("../../login/classes/player");

Members = []
class MGroupMember{
    constructor(playerid, group, rank)
    {
        this.playerid = playerid;
        this.group = group;
        this.rank = rank;

        if(!Members[playerid])
        {
            Members[playerid] = [];
        }
        Members[playerid][group] = this;
    }
}

function findPlayerGroups(player){
    const MPlayer = getPlayerById(player.playerid);
    return Members[MPlayer.id];
}

module.exports = {MGroupMember, Members, findPlayerGroups};