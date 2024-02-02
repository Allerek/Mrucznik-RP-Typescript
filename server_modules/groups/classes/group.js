const { addCommand } = require("../../commands/commands");
const { COLORS } = require("../../definitions/colors");
const { SERVER_CONFIG } = require("../../definitions/serverConfig");
const { findPlayerGroups, MGroupMember } = require("./groupMember");

const GROUP_PERMISSIONS = {
    LAW_ENFORCEMENT: 1, //Kajdanki, wiezienia, 
    MEDICAL: 2,
    CRIME: 4,
    GUNSHOP: 8,
    NEWS: 16,
    WORKSHOP: 32,
    RACE: 64,
    MEGAPHONE: 128,
}

const GROUP_TYPES = {
    0: [
        GROUP_PERMISSIONS.LAW_ENFORCEMENT,
        GROUP_PERMISSIONS.MEGAPHONE
    ]   
}

let Groups = {}
class MGroup{
    constructor(id, name, type){
        this.id = id;
        this.name = name;
        this.type = type;
        this.members = [];
        for(let permission in GROUP_TYPES[type]){
            this.permissions |= GROUP_TYPES[type][permission];
        }
        if(SERVER_CONFIG.DEV){
            //Verify permissions - LSPD
            console.log("DEV: Verify permissions for group "+this.name+"("+this.id+") Megaphone:", this.hasPermission(GROUP_PERMISSIONS.MEGAPHONE));
            console.log("DEV: Verify permissions for group "+this.name+"("+this.id+") Crime:", this.hasPermission(GROUP_PERMISSIONS.CRIME));
        }
        Groups[id] = this;
    }

    addMember(playerUID, rank){
        const member = new MGroupMember(playerUID, this, rank);
        this.members.push(member);
        return member;
    }

        /**
     * Grants the specified permission to the user.
     * 
     * @param {number} permission - The permission to grant.
     */
    grantPermission(permission) {
        this.permissions |= permission; // bitwise OR assignment to grant the permission
    }
    
    /**
     * Revoke a specific permission from the current permissions.
     * 
     * @param {number} permission - The permission to be revoked.
     */
    revokePermission(permission) {
        this.permissions &= ~permission;
    }

    /**
     * Check if the given permission is present in the permissions bitmask.
     * 
     * @param {number} permission - The permission to check.
     * @returns {boolean} - True if the permission is present, false otherwise.
     */
    hasPermission(permission) {
        return (this.permissions & permission) !== 0;
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
        player.SendClientMessage(COLORS.WHITE, "Grupa: " + group.name + " (" + group.id + ") || Ranga: "+ groupMember.rank);
    }
}

module.exports = {MGroup, Groups};