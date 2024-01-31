const { addCommand } = require("../../commands/commands");
const { COLORS } = require("../../definitions/colors");
const { findPlayerGroups, MGroupMember } = require("./groupMember");




let Groups = {}
class MGroup{
    constructor(id, name, type){
        this.id = id;
        this.name = name;
        this.type = type;
        this.members = [];

        Groups[id] = this;
    }

    addMember(playerUID, rank){
        const member = new MGroupMember(playerUID, this, rank);
        this.members.push();
    }
}

addCommand("grupy", checkGroups);

function checkGroups(player)
{
    const playerGroups = findPlayerGroups(player);
    console.log(playerGroups);
    for(let i in playerGroups)
    {
        const group = playerGroups[i].group;
        const groupMember = playerGroups[i];
        console.log(playerGroups[i]);
        player.SendClientMessage(COLORS.WHITE, "Grupa: " + group.name + " (" + group.id + ")");
        player.SendClientMessage(COLORS.WHITE, "Ranga: " + groupMember.rank);
    }
}

module.exports = {MGroup, Groups};