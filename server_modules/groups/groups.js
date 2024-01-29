const { OnGameModeInit } = require("samp-node-lib");
const { MGroup, Groups } = require("./classes/group");

OnGameModeInit(()=>{
    pool.query("SELECT * FROM `mru_grupy`", [], function(error, results, fields){
        console.log("[GROUPS] Loading "+results.length+" groups.");
        results.forEach((group)=>{
            Groups[group.id] = new MGroup(group.id, group.name, group.leader);
            console.log("Group: "+group.name+"("+group.id+") loaded!")
        })
    });
});