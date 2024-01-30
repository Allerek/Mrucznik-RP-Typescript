const { OnPlayerText, SendClientMessage, SampPlayer, OnPlayerConnect, getPlayers} = require("samp-node-lib");
let {getPlayerList, getPlayerById, MPlayer, Players } = require("../login/classes/player");
const { COLORS } = require("../definitions/colors");
const { addCommand } = require("../commands/commands");
const CHAT_RANGE = 20.0;
const LOUD_RANGE = 30.0;
const CHATBUBBLE_TIME = 8000;

OnPlayerText((player, text) => {
    const MPlayer = getPlayerById(player.playerid);
    if(MPlayer.gagged){
        player.SendClientMessage(COLORS.WHITE, "Nie mozesz mowic bedac zakneblowanym!");
    }
    player.SetPlayerChatBubble(text, COLORS.FADE1, CHAT_RANGE, CHATBUBBLE_TIME);
    //Chat IC mówi
    player.RangeMessageColor(MPlayer.name+" "+MPlayer.surName+" mowi: "+text, 20, COLORS.FADE1, COLORS.FADE2, COLORS.FADE3, COLORS.FADE4, COLORS.FADE5);
    return 0;
})


addCommand("k", loudChat)
addCommand("krzyk", loudChat)
addCommand("krzycz", loudChat)

function loudChat(player, ...textc)
{
    const text = textc.join(' ');
    const MPlayer = getPlayerById(player.playerid);
    if(MPlayer.gagged){
        player.SendClientMessage(COLORS.WHITE, "Nie mozesz mowic bedac zakneblowanym!");
    }
    player.SetPlayerChatBubble(text, COLORS.FADE1, LOUD_RANGE, CHATBUBBLE_TIME);
    player.RangeMessageColor(MPlayer.name+" "+MPlayer.surName+" krzyczy: "+text, LOUD_RANGE, COLORS.FADE1, COLORS.FADE2, COLORS.FADE3, COLORS.FADE4, COLORS.FADE5);

    player.ApplyAnimation("ON_LOOKERS", "shout_01", 4.0, 0, 0, 0, 0, 0);
    player.ApplyAnimation("ON_LOOKERS", "shout_01", 4.0, 0, 0, 0, 0, 0);
    return 0;
}


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
        // Zak?adaj?c, ?e c1 to rgba(230, 230, 230, 255) i c5 to rgba(110, 110, 110, 109.65)
        // Obliczanie wspó?czynnika interpolacji
        const interpolationFactor = 1.0 - (distance / range);

        // Interpolacja dla ka?dej sk?adowej koloru
        const r = Math.round(c1.r * interpolationFactor + c5.r * (1 - interpolationFactor));
        const g = Math.round(c1.g * interpolationFactor + c5.g * (1 - interpolationFactor));
        const b = Math.round(c1.b * interpolationFactor + c5.b * (1 - interpolationFactor));
        const a = Math.round(c1.a * interpolationFactor + c5.a * (1 - interpolationFactor));

        // Zbuduj ci?g znaków reprezentuj?cy kolor w formacie rgba
        const interpolatedColorString = `rgba(${r}, ${g}, ${b}, ${a})`;

        // Wy?lij wiadomo?? z u?yciem ci?gu znaków reprezentuj?cego kolor
        player.sendMessageEx(interpolatedColorString, text);

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