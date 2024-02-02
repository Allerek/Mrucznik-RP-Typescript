const { OnPlayerText, SendClientMessage, SampPlayer, OnPlayerConnect, getPlayers} = require("samp-node-lib");
let {getPlayerList, getPlayerById, MPlayer, Players } = require("../login/classes/player");
const iconv = require('iconv-lite');
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
    //Chat IC m�wi
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

        // Calculate darkness factor based on distance
        const darknessFactor = distance / range;

        // Apply darkness to each color component
        const r = Math.round(230 - 120 * darknessFactor);  // Starting from 230 and reducing red component
        const g = Math.round(230 - 120 * darknessFactor);  // Starting from 230 and reducing green component
        const b = Math.round(230 - 120 * darknessFactor);  // Starting from 230 and reducing blue component

        // Ensure the color values are within valid range (0-255)
        const finalR = Math.max(0, Math.min(255, r));
        const finalG = Math.max(0, Math.min(255, g));
        const finalB = Math.max(0, Math.min(255, b));

        // Build the rgba string
        const interpolatedColorString = `rgba(${finalR}, ${finalG}, ${finalB}, 255)`;

        // Send the message with the calculated color
        console.log(interpolatedColorString);
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