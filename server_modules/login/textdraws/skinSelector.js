const {
    TextDrawCreate,
    TextDrawLetterSize,
    TextDrawTextSize,
    TextDrawAlignment,
    TextDrawColor,
    TextDrawBoxColor,
    TextDrawSetShadow,
    TextDrawSetOutline,
    TextDrawFont,
    TextDrawSetProportional,
    TextDrawSetSelectable,
    OnPlayerClickTextDraw
} = require("samp-node-lib");
const {
    Players,
    getPlayerById,
    MPlayer
} = require("../classes/player");
const {
    pool
} = require("../../mysql/mysql");
const { COLORS } = require("../../definitions/colors");

SkinSelector = {}

//TODO: Selekcja skinów, które są zablokowane itd.
//0 - Męskie 1 - Żeńskie
Skins = {
    0: [0, 1, 2, 7, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 32, 33, 34, 35, 36, 37, 43, 44, 45, 46, 47, 48, 49, 50, 51, 52, 57, 58, 59, 60, 61, 62, 66, 67, 68, 70, 71, 72, 73, 78, 79, 80, 81, 82, 83, 84, 94, 95, 96, 97, 98, 99, 100, 101, 102, 103, 104, 105, 106, 107, 108, 109, 110, 111, 112, 113, 114, 115, 116, 117, 118, 120, 121, 122, 123, 124, 125, 126, 127, 128, 132, 133, 134, 135, 136, 137, 142, 143, 144, 146, 147, 153, 154, 155, 156, 158, 159, 160, 161, 162, 163, 164, 165, 166, 167, 168, 170, 171, 173, 174, 175, 176, 177, 179, 180, 181, 182, 183, 184, 185, 186, 187, 188, 189, 200, 202, 203, 204, 206, 209, 210, 212, 213, 217, 220, 221, 222, 223, 227, 228, 229, 230, 234, 235, 236, 239, 240, 241, 242, 247, 248, 249, 250, 252, 253, 254, 255, 258, 259, 260, 261, 262, 264, 265, 266, 267, 268, 269, 270, 271, 272, 274, 275, 276, 277, 278, 279, 280, 281, 282, 283, 284, 285, 286, 287, 288, 290, 291, 292, 293, 294, 295, 296, 297, 299, 300, 301, 302, 303, 304, 305, 306, 307, 308, 309, 310, 311],
    1: [9, 10, 11, 12, 13, 31, 38, 39, 40, 41, 53, 54, 55, 56, 63, 64, 69, 75, 76, 77, 85, 87, 88, 89, 90, 91, 92, 93, 129, 130, 131, 138, 139, 140, 141, 145, 148, 150, 151, 152, 157, 169, 172, 178, 190, 191, 192, 193, 194, 195, 196, 197, 198, 199, 201, 205, 207, 211, 214, 215, 216, 218, 219, 224, 225, 226, 231, 232, 233, 237, 238, 243, 244, 245, 246, 251, 256, 257, 263, 298]
}

function initSkinSelectorTXD() {
    NowaWybieralka_Left = TextDrawCreate(250.154693, 383.833343, "<<<");

    TextDrawLetterSize(NowaWybieralka_Left, 0.449999, 1.600000);
    TextDrawTextSize(NowaWybieralka_Left, 18.000000, 47.833335);
    TextDrawAlignment(NowaWybieralka_Left, 2);
    TextDrawColor(NowaWybieralka_Left, "rgba(216, 230, 255, 173)");
    //TextDrawUseBox(NowaWybieralka_Left, true);
    TextDrawBoxColor(NowaWybieralka_Left, "rgba(102, 102, 102, 102)");
    TextDrawSetShadow(NowaWybieralka_Left, 0);
    TextDrawSetOutline(NowaWybieralka_Left, 1);
    //TextDrawBackgroundColor(NowaWybieralka_Left, 255);
    TextDrawFont(NowaWybieralka_Left, 2);
    TextDrawSetProportional(NowaWybieralka_Left, 1);
    TextDrawSetSelectable(NowaWybieralka_Left, 1);
    SkinSelector['left'] = NowaWybieralka_Left;

    NowaWybieralka_Select = TextDrawCreate(312.503204, 363.833465, ">OK<");
    TextDrawLetterSize(NowaWybieralka_Select, 0.449999, 1.600000);
    TextDrawTextSize(NowaWybieralka_Select, 18.000000, 51.916660);
    TextDrawAlignment(NowaWybieralka_Select, 2);
    TextDrawColor(NowaWybieralka_Select, "rgba(216, 230, 255, 173)");
    //TextDrawUseBox(NowaWybieralka_Select, true);
    TextDrawBoxColor(NowaWybieralka_Select, "rgba(102, 102, 102, 102)");
    TextDrawSetShadow(NowaWybieralka_Select, 0);
    TextDrawSetOutline(NowaWybieralka_Select, 1);
    //TextDrawBackgroundColor(NowaWybieralka_Select, 255);
    TextDrawFont(NowaWybieralka_Select, 2);
    TextDrawSetProportional(NowaWybieralka_Select, 1);
    TextDrawSetSelectable(NowaWybieralka_Select, 1);
    SkinSelector['select'] = NowaWybieralka_Select;
    
    NowaWybieralka_Right = TextDrawCreate(373.914733, 383.833343, ">>>");
    TextDrawLetterSize(NowaWybieralka_Right, 0.449999, 1.600000);
    TextDrawTextSize(NowaWybieralka_Right, 18.000000, 46.083316);
    TextDrawAlignment(NowaWybieralka_Right, 2);
    TextDrawColor(NowaWybieralka_Right, "rgba(216, 230, 255, 173)");
    //TextDrawUseBox(NowaWybieralka_Right, true);
    TextDrawBoxColor(NowaWybieralka_Right, "rgba(102, 102, 102, 102)");
    TextDrawSetShadow(NowaWybieralka_Right, 0);
    TextDrawSetOutline(NowaWybieralka_Right, 1);
    //TextDrawBackgroundColor(NowaWybieralka_Right, 255);
    TextDrawFont(NowaWybieralka_Right, 2);
    TextDrawSetProportional(NowaWybieralka_Right, 1);
    TextDrawSetSelectable(NowaWybieralka_Right, 1);
    SkinSelector['right'] = NowaWybieralka_Right;
}

OnPlayerClickTextDraw((player, txd) => {
    if (txd == SkinSelector['left']) {
        const MPlayer = getPlayerById(player.playerid);
        const sex = MPlayer.sex;
        const currentSkin = MPlayer.skinSelectorSkin
        if (currentSkin - 1 < 1) {
            MPlayer.skinSelectorSkin = Skins[sex].length - 1;
        } else {
            MPlayer.skinSelectorSkin = MPlayer.skinSelectorSkin - 1;
        }
        //console.log("Left", sex, Players[player.playerid].skinSelectorSkin, Skins[sex][Players[player.playerid].skinSelectorSkin], Skins[sex].length)
        player.SetPlayerSkin(Skins[sex][MPlayer.skinSelectorSkin]);
    } else if (txd == SkinSelector['right']) {
        const MPlayer = getPlayerById(player.playerid);
        const sex = MPlayer.sex;
        const currentSkin = MPlayer.skinSelectorSkin
        if (currentSkin + 1 >= Skins[sex].length) {
            MPlayer.skinSelectorSkin = 1;
        } else {
            MPlayer.skinSelectorSkin = currentSkin + 1;
        }
        //console.log("Right", sex, Players[player.playerid].skinSelectorSkin, Skins[sex][Players[player.playerid].skinSelectorSkin], Skins[sex].length);
        player.SetPlayerSkin(Skins[sex][MPlayer.skinSelectorSkin]);
    } else if (txd == SkinSelector['select']) {
        const MPlayer = getPlayerById(player.playerid);
        for (let i = 0; i < 15; i++) {
            player.SendClientMessage(COLORS.WHITE, "");
        }
        player.SendClientMessage(COLORS.YELLOW, "Witaj na Mrucznik Role Play serwer.");
        player.CancelSelectTextDraw();
        player.TextDrawHideForPlayer(SkinSelector['select']);
        player.TextDrawHideForPlayer(SkinSelector['left']);
        player.TextDrawHideForPlayer(SkinSelector['right']);
        const name = player.GetPlayerName(24);
        const sex = MPlayer.sex;
        const age = MPlayer.age;
        const origin = MPlayer.origin;
        const currentSkin = Skins[sex][MPlayer.skinSelectorSkin];
        MPlayer.setSkin(currentSkin);
        MPlayer.spawnPlayer();
        player.SetPlayerVirtualWorld(0);
        player.SetPlayerInterior(0);
        player.TogglePlayerControllable(1);
        player.SetCameraBehindPlayer();
        //console.log("Select", sex, Players[player.playerid].skinSelectorSkin, Skins[sex][Players[player.playerid].skinSelectorSkin], Skins[sex].length);
        pool.query("UPDATE `mru_konta` SET `ConnectedTime` = 1, `Skin` = ?, `Sex` = ?, `Age` = ?, `Origin` = ? WHERE `Nick` = ? ", [currentSkin, sex, age, origin, name], function () {
            console.log("Player "+name+" finished introduction.");
            Players[player].setLoggedIn(true);
        });
    }
})

module.exports = {
    SkinSelector,
    initSkinSelectorTXD,
    Skins
}