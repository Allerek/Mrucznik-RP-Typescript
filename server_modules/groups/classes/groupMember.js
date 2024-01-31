const { getPlayerById } = require("../../login/classes/player");

GroupMemberPermissions = {
    LEADER: 1,
    MANAGE_SETTINGS: 2,
    MANAGER_MEMBERS: 4,
}

Members = []
class MGroupMember{
    constructor(player, group, rank)
    {
        this.player = player;
        this.group = group;
        this.rank = rank;

        if(!Members[player])
        {
            Members[player] = [];
        }
        Members[player][group] = this;
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

function findPlayerGroups(player){
    const MPlayer = getPlayerById(player.playerid);
    return Members[MPlayer.id];
}

module.exports = {MGroupMember, Members, findPlayerGroups};