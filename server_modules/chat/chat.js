const { OnPlayerText, SendClientMessage, SampPlayer, OnPlayerConnect, getPlayers} = require("samp-node-lib");
let {getPlayerList, getPlayerById, MPlayer, Players } = require("../login/classes/player");
const { COLORS } = require("../definitions/colors");
const CHAT_RANGE = 20.0;
const CHATBUBBLE_TIME = 8000;

OnPlayerText((player, text) => {
    const MPlayer = getPlayerById(player.playerid);
    if(MPlayer.gagged){
        player.SendClientMessage(COLORS.WHITE, "Nie mozesz mowic bedac zakneblowanym!");
    }
    player.SetPlayerChatBubble(text, COLORS.FADE1, CHAT_RANGE, CHATBUBBLE_TIME);
    //Chat IC mówi
    player.RangeMessageColor(MPlayer.name+" "+MPlayer.surName+" mówi: "+text, 20, COLORS.YELLOW, COLORS.WHITE, COLORS.WHITE, COLORS.WHITE, COLORS.WHITE);
    return 0;
})


SampPlayer.prototype.RangeMessageColor = function(text, range, c1, c2, c3, c4, c5)
{
    const pos = this.GetPlayerPos();
    const x = pos[0];
    const y = pos[1];
    const z = pos[2];
    SystemRangeMessageColor(x, y, z, this.GetPlayerVirtualWorld(), text, range, c1, c2, c3, c4, c5)
}

function SystemRangeMessageColor(x, y, z, vw, text, range, c1, c2, c3, c4, c5)
{
    const PlayerList = getPlayers()
    for(let player of PlayerList)
    {
        const MPlayer = Players[player]
        if(!MPlayer.loggedIn) continue;
        if((!player.GetPlayerVirtualWorld() == vw) && (vw != 1)) continue;
        const distance = player.GetPlayerDistanceFromPoint(x, y, z);
        //TODO: przepisac na skalowanie koloru
        if(distance<range){
            if(distance<=range/16){
                player.sendMessageEx(c1, text);
            }else if(distance<=range/8){
                player.sendMessageEx(c2, text);
            }else if(distance<=range/4){
                player.sendMessageEx(c3, text);
            }else if(distance<=range/2){
                player.sendMessageEx(c4, text);
            }else{
                player.sendMessageEx(c5, text);
            }
        }
    }
    return 1;
}

SampPlayer.prototype.sendMessageEx = function(color, text)
{
    if (text.length <= 128) {
        return this.SendClientMessage(color, text);
    }
    let space = text.lastIndexOf(' ', 128 - 5);
    space = space > text * 0.75 ? space : text - 5;
    const b1 = text.substring(0, space) + '...';
    const b2 = '...' + text.substring(space + 1);
    const buffer = Buffer.alloc(128);
    const buffer2 = Buffer.alloc(128);
    buffer.write(b1, "base64");
    buffer2.write(b2, "base64");
    this.SendClientMessage(color, buffer);
    this.SendClientMessage(color, buffer2);
    return 1;
}