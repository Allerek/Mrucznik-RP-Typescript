const { OnPlayerCommandText, OnGameModeInit } = require("samp-node-lib");
const { COLORS } = require("../definitions/colors");

const Commands = [];

OnPlayerCommandText((player, cmdtext) => {
    const args = cmdtext.split(" ");
    const command = args[0].replace("/", "");
    args.splice(0, 1);
    if (Commands[command]){
        Commands[command](player, ...args);
    }else{
        player.SendClientMessage(COLORS.WHITE, "Komendy nie znaleziono");
    }
    return 1;
})


function addCommand(commandName, callBack)
{
    Commands[commandName] = callBack;
    console.log(Commands);
}

module.exports = {
    addCommand
}