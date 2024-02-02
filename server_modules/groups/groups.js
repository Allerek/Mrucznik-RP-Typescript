const { OnGameModeInit } = require("samp-node-lib");
const { MGroup, Groups } = require("./classes/group");
const { GROUP_MEMBER_PERMISSIONS } = require("./classes/groupMember");
const { SERVER_CONFIG } = require("../definitions/serverConfig");
const pool = require("../mysql/mysql").pool; //Obiekt połączenia MySQL



OnGameModeInit(()=>{
    pool.query("SELECT * FROM `mru_grupy`", [], function(error, results, fields){
        console.log("[GROUPS] Loading "+results.length+" groups.");
        results.forEach((group)=>{
            Groups[group.id] = new MGroup(group.id, group.name, group.type);
            pool.query("SELECT * FROM `mru_grupy_members` WHERE `group_id` = ?", [group.id], function(error, results, fields){
                results.forEach((member)=>{
                    const groupMember = Groups[group.id].addMember(member.UID, member.rank);
                    if(SERVER_CONFIG.DEV){
                        groupMember.grantPermission(GROUP_MEMBER_PERMISSIONS.LEADER);
                        console.log("DEV: Group Member Permissions test for member "+member.UID+" in group "+group.name+"("+group.id+") LEADER:", groupMember.hasPermission(GROUP_MEMBER_PERMISSIONS.LEADER));
                    }
                    console.log("Adding member: "+member.UID+" to group: "+group.name+"("+group.id+")");
                })
            });
            console.log("Group: "+group.name+"("+group.id+") loaded!"); //Na moim głównym pc musi być GROUP.ID, na drugim PC group.id - chuj wie od czego to zależy lol
        })
    });
});