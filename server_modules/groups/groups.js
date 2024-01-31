const { OnGameModeInit } = require("samp-node-lib");
const { MGroup, Groups } = require("./classes/group");
const pool = require("../mysql/mysql").pool; //Obiekt połączenia MySQL

OnGameModeInit(()=>{
    pool.query("SELECT * FROM `mru_grupy`", [], function(error, results, fields){
        console.log("[GROUPS] Loading "+results.length+" groups.");
        results.forEach((group)=>{
            console.log(group);
            Groups[group.ID] = new MGroup(group.ID, group.name, group.type);
            pool.query("SELECT * FROM `mru_grupy_members` WHERE `group_id` = ?", [group.ID], function(error, results, fields){
                results.forEach((member)=>{
                    Groups[group.ID].addMember(member.UID, member.rank);
                    console.log("Adding member: "+member.UID+" to group: "+group.ID);
                })
            });
            console.log("Group: "+group.name+"("+group.ID+") loaded!")
        })
    });
});