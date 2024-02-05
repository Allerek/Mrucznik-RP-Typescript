import {TextDraw, TextDrawAlignEnum, TextDrawEvent, TextDrawFontsEnum } from "@infernus/core"
import { getMPlayer } from "./classes/player";
import { COLORS } from "@/enums/colors";
import { $t } from "@/i18n";
import connection from "@/mysql/mysql";
import { RowDataPacket } from "mysql2";

//TODO: Selekcja skinów, które są zablokowane itd.
//0 - Męskie 1 - Żeńskie
export const Skins = {
    0: [0, 1, 2, 7, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 32, 33, 34, 35, 36, 37, 43, 44, 45, 46, 47, 48, 49, 50, 51, 52, 57, 58, 59, 60, 61, 62, 66, 67, 68, 70, 71, 72, 73, 78, 79, 80, 81, 82, 83, 84, 94, 95, 96, 97, 98, 99, 100, 101, 102, 103, 104, 105, 106, 107, 108, 109, 110, 111, 112, 113, 114, 115, 116, 117, 118, 120, 121, 122, 123, 124, 125, 126, 127, 128, 132, 133, 134, 135, 136, 137, 142, 143, 144, 146, 147, 153, 154, 155, 156, 158, 159, 160, 161, 162, 163, 164, 165, 166, 167, 168, 170, 171, 173, 174, 175, 176, 177, 179, 180, 181, 182, 183, 184, 185, 186, 187, 188, 189, 200, 202, 203, 204, 206, 209, 210, 212, 213, 217, 220, 221, 222, 223, 227, 228, 229, 230, 234, 235, 236, 239, 240, 241, 242, 247, 248, 249, 250, 252, 253, 254, 255, 258, 259, 260, 261, 262, 264, 265, 266, 267, 268, 269, 270, 271, 272, 274, 275, 276, 277, 278, 279, 280, 281, 282, 283, 284, 285, 286, 287, 288, 290, 291, 292, 293, 294, 295, 296, 297, 299, 300, 301, 302, 303, 304, 305, 310, 311],
    1: [9, 10, 11, 12, 13, 31, 38, 39, 40, 41, 53, 54, 55, 56, 63, 64, 69, 75, 76, 77, 85, 87, 88, 89, 90, 91, 92, 93, 129, 130, 131, 138, 139, 140, 141, 145, 148, 150, 151, 152, 157, 169, 172, 178, 190, 191, 192, 193, 194, 195, 196, 197, 198, 199, 201, 205, 207, 211, 214, 215, 216, 218, 219, 224, 225, 226, 231, 232, 233, 237, 238, 243, 244, 245, 246, 251, 256, 257, 263, 298, 306, 307, 308, 309]
}

export interface SkinSelector {
    [key: string]: TextDraw
  }
  

export const SkinSelector:SkinSelector = {}
export function initSkinSelector(){
    
    const SkinSelector_Left = new TextDraw({
        x: 250.154693,
        y: 383.833343,
        text: "<<<"
    })
    SkinSelector_Left.create();
    SkinSelector_Left.setLetterSize(0.449999, 1.600000);
    SkinSelector_Left.setTextSize(18.000000, 47.833335);
    SkinSelector_Left.setAlignment(TextDrawAlignEnum.CENTER);
    SkinSelector_Left.setColor("rgba(216, 230, 255, 173)");
    SkinSelector_Left.setBoxColors("rgba(102, 102, 102, 102)");
    SkinSelector_Left.setShadow(0);
    SkinSelector_Left.setOutline(1);
    SkinSelector_Left.setFont(TextDrawFontsEnum.BANK_GOTHIC);
    SkinSelector_Left.setProportional(true);
    SkinSelector_Left.setSelectable(true);

    const SkinSelector_Select = new TextDraw({
        x: 312.503204,
        y: 363.833465,
        text: "OK"
    })
    SkinSelector_Select.create();
    SkinSelector_Select.setLetterSize(0.449999, 1.600000);
    SkinSelector_Select.setTextSize(18.000000, 51.916660);
    SkinSelector_Select.setAlignment(TextDrawAlignEnum.CENTER);
    SkinSelector_Select.setColor("rgba(216, 230, 255, 173)");
    SkinSelector_Select.setBoxColors("rgba(102, 102, 102, 102)");
    SkinSelector_Select.setShadow(0);
    SkinSelector_Select.setOutline(1);
    SkinSelector_Select.setFont(TextDrawFontsEnum.BANK_GOTHIC);
    SkinSelector_Select.setProportional(true);
    SkinSelector_Select.setSelectable(true);

    const SkinSelector_Right = new TextDraw({
        x: 373.914733,
        y: 383.833343,
        text: ">>>"
    })
    SkinSelector_Right.create();
    SkinSelector_Right.setLetterSize(0.449999, 1.600000);
    SkinSelector_Right.setTextSize(18.000000, 46.083316);
    SkinSelector_Right.setAlignment(TextDrawAlignEnum.CENTER);
    SkinSelector_Right.setColor("rgba(216, 230, 255, 173)");
    SkinSelector_Right.setBoxColors("rgba(102, 102, 102, 102)");
    SkinSelector_Right.setShadow(0);
    SkinSelector_Right.setOutline(1);
    SkinSelector_Right.setFont(TextDrawFontsEnum.BANK_GOTHIC);
    SkinSelector_Right.setProportional(true);
    SkinSelector_Right.setSelectable(true);
    (SkinSelector as any)["left"] = SkinSelector_Left; //eslint-disable-line @typescript-eslint/no-explicit-any
    (SkinSelector as any)["right"] = SkinSelector_Right; //eslint-disable-line @typescript-eslint/no-explicit-any
    (SkinSelector as any)["select"] = SkinSelector_Select; //eslint-disable-line @typescript-eslint/no-explicit-any
}

TextDrawEvent.onPlayerClickGlobal(({player, textDraw, next})=> {
    if(textDraw == SkinSelector["left"]){
        const MPlayer = getMPlayer(player);
        const sex = MPlayer.sex;
        const currentSkin = MPlayer.skinSelectorSkin;
        if(currentSkin-1<1){
            const length = (Skins as Record<number, number[]>)[sex].length;
            MPlayer.skinSelectorSkin = length;
        }else{
            MPlayer.skinSelectorSkin = MPlayer.skinSelectorSkin - 1;
        }
        //@ts-expect-error Chuj wie czemu to pluje, jak ktoś się bardziej zna to kiedyś naprawi - póki co działa
        const selectedSkin: number = Skins[sex][MPlayer.skinSelectorSkin];
        console.log(selectedSkin);
        player.setSkin(selectedSkin);
    }else if(textDraw == SkinSelector["right"]){
        const MPlayer = getMPlayer(player);
        const sex = MPlayer.sex;
        const currentSkin = MPlayer.skinSelectorSkin;
        const length = (Skins as Record<number, number[]>)[sex].length;
        if(currentSkin+1>length){
            MPlayer.skinSelectorSkin = 1;
        }else{
            MPlayer.skinSelectorSkin = currentSkin + 1;
        }
        //@ts-expect-error Chuj wie czemu to pluje, jak ktoś się bardziej zna to kiedyś naprawi - póki co działa
        const selectedSkin: number = Skins[sex][MPlayer.skinSelectorSkin];
        player.setSkin(selectedSkin);
    }else if(textDraw == SkinSelector["select"]){
        for(let i = 0; i < 10; i++){
            player.sendClientMessage(COLORS.WHITE, "");
        }
        player.sendClientMessage(COLORS.YELLOW, $t("login.intro.welcome"));
        player.cancelSelectTextDraw();
        SkinSelector["left"].hide(player);
        SkinSelector["right"].hide(player);
        SkinSelector["select"].hide(player);
        const MPlayer = getMPlayer(player);
        const sex = MPlayer.sex;
        //@ts-expect-error Chuj wie czemu to pluje, jak ktoś się bardziej zna to kiedyś naprawi - póki co działa
        const selectedSkin: number = Skins[sex][MPlayer.skinSelectorSkin];
        const name = player.getName();
        const age = MPlayer.age;
        const origin = MPlayer.origin;
        MPlayer.skin = selectedSkin;
        MPlayer.spawnPlayer();
        player.setSkin(selectedSkin);
        player.setVirtualWorld(0);
        player.setInterior(0);
        player.toggleControllable(true);
        player.setCameraBehind();
        connection.query<RowDataPacket[]>("UPDATE `mru_konta` SET `ConnectedTime` = 1, `Skin` = ?, `Sex` = ?, `Age` = ?, `Origin` = ? WHERE `Nick` = ? ", [selectedSkin, sex, age, origin, name], (_err) => {
            if(_err){
                throw _err;
            }
            MPlayer.loggedIn = true;
        })
    }
    next();
})