import connection from "@/mysql/mysql";
import { $t } from "../i18n/index";
import {RowDataPacket} from "mysql2";
import { CameraCutStylesEnum, Dialog, DialogStylesEnum, Player, PlayerEvent } from "@infernus/core";
import { COLORS } from "@/enums/colors";
import { compare, hash } from "bcryptjs";
import { MPlayer, getMPlayer } from "./classes/player";
import pl_PL from "../i18n/locales/pl-PL.json";
import { SkinSelector, Skins } from "./skinSelector";

PlayerEvent.onConnect(({player, next}) => {
    player.locale = "pl_PL";
    player.charset = "Windows-1250"
    console.log(player);
    const name = player.getName();
    player.toggleSpectating(true);
    console.log(name + " has joined the server.");
    connection.query<RowDataPacket[]>('SELECT Nick FROM `mru_konta` WHERE `Nick` = ? LIMIT 1', [name], async (_err, rows) => {
        if(rows && rows.length > 0){ //Account exists
            player.sendClientMessage(COLORS.WHITE, $t("login.welcome", [name]));
            const dialog = new Dialog({
                style: DialogStylesEnum.PASSWORD,
                caption: "Logowanie",
                info: $t("login.dialog_login", [name]),
                button1: "Zaloguj",
                button2: "Wyjdź",
            })
            let password;
            const {inputText: password_dialog} = await dialog.show(player);
            password = password_dialog;
            if(!password) {
                player.sendClientMessage(COLORS.RED, $t("login.no_password"));
                return setTimeout((player) => player.kick(), 500, player);
            } 
            while(password.length < 3){
                player.sendClientMessage(COLORS.RED, $t("login.short_password"));
                const {inputText: password_dialog} = await dialog.show(player);
                password = password_dialog;
            }
            if(player.isConnected()){
                connection.query<RowDataPacket[]>('SELECT * FROM `mru_konta` WHERE `Nick` = ? LIMIT 1', [name], (_err, rows) => {
                    compare(password, rows[0].password).then((result)=>{
                        if(result){//Password is correct
                            console.log(name + " has logged in.");
                            if(rows[0].ConnectedTime != 0){
                                const splitName = name.split("_");
                                const MPlayerObj = new MPlayer(rows[0].UID, player, splitName[0], splitName[1], rows[0].Money, rows[0].Skin, rows[0].ConnectedTime);
                                MPlayerObj.spawnPlayer();
                                player.sendClientMessage(COLORS.WHITE, $t("login.logged_in", [name]));
                            }else{
                                const splitName = name.split("_");
                                new MPlayer(rows[0].UID, player, splitName[0], splitName[1], rows[0].Money, rows[0].Skin, rows[0].ConnectedTime);
                                performIntro(player);
                            }
                        }else{//Wrong password
                            player.sendClientMessage(COLORS.RED, $t("login.wrong_password"));
                            setTimeout((player) => player.kick(), 500, player);
                        }
                    })
                })
            }
        }else{//Account doesn't exist
            player.sendClientMessage(COLORS.WHITE, $t("login.welcome_register", [name]));
            const dialog = new Dialog({
                style: DialogStylesEnum.PASSWORD,
                caption: "Rejestracja",
                info: $t("login.dialog_register"),
                button1: "Zarejestruj",
                button2: "Wyjdź"
            })
            let password;
            const {inputText: password_dialog} = await dialog.show(player);
            password = password_dialog;
            if(!password) {
                player.sendClientMessage(COLORS.RED, $t("login.no_password"));
                return setTimeout((player) => player.kick(), 500, player);
            }
            while(password.length < 3){
                player.sendClientMessage(COLORS.RED, $t("login.short_password"));
                const {inputText: password_dialog} = await dialog.show(player);
                password = password_dialog;
            }
            if(player.isConnected()){
                hash(password, 10).then((hash)=>{
                    connection.query<RowDataPacket[]>("INSERT INTO `mru_konta` (`Nick`, `password`) VALUES(?,?)", [name, hash], (_err) => {
                        if (_err) {
                            console.log(_err);
                            player.sendClientMessage(COLORS.WHITE, $t("login.register_error"));
                            player.kick();
                        }else{
                            connection.query<RowDataPacket[]>('SELECT * FROM `mru_konta` WHERE `Nick` = ? LIMIT 1', [name], (_err, rows) => {
                                if(rows && rows.length > 0){
                                    console.log(name + " has registered.");
                                    const splitName = name.split("_");
                                    new MPlayer(rows[0].UID, player, splitName[0], splitName[1], rows[0].Money, rows[0].Skin, rows[0].connectedTime);
                                    performIntro(player);
                                }
                            })
                        }
                    })
                })
            } 
        }
    })
    next();
})

async function performIntro(player: Player){
    const MPlayer = getMPlayer(player);
    for(let i = 0; i < 10; i++){
        player.sendClientMessage(COLORS.WHITE, "");
    }
    player.sendClientMessage(COLORS.YELLOW, $t("login.intro.welcome"));
    player.sendClientMessage(COLORS.YELLOW, $t("login.intro.welcome2"));
    const dialog = new Dialog({
        style: DialogStylesEnum.MSGBOX,
        caption: $t("login.intro.welcome"),
        info: $t("login.intro.welcome_dialog"),
        button1: $t("dialog.next"),
    })
    await dialog.show(player);
    const dialog_sex = new Dialog({
        style:DialogStylesEnum.LIST,
        caption: $t("login.intro.dialog_sex"),
        info: $t("login.intro.dialog_sex_choices"),
        button1: $t("dialog.next"),
    })
    const {inputText: sex_choice} = await dialog_sex.show(player);
    if(sex_choice == "Mężczyzna"){
        MPlayer.sex = 0;
    }else if(sex_choice == "Kobieta"){
        MPlayer.sex = 1;
    }
    player.sendClientMessage(COLORS.WHITE, $t("login.intro.dialog_sex_done", [sex_choice]));
    const dialog_origin = new Dialog({
        style:DialogStylesEnum.LIST,
        caption:$t("login.intro.dialog_origin"),
        info:$t("login.intro.dialog_origin_choices"),
        button1:$t("dialog.next"),
    })
    const {inputText: origin_choice} = await dialog_origin.show(player);
    if(origin_choice == "USA"){
        MPlayer.origin = 0;
    }else if(origin_choice == "Europa"){
        MPlayer.origin = 1;
    }else if(origin_choice == "Azja"){
        MPlayer.origin = 2;
    }
    player.sendClientMessage(COLORS.WHITE, $t("login.intro.dialog_origin_done", [origin_choice]));
    const dialog_age = new Dialog({
        style:DialogStylesEnum.INPUT,
        caption:$t("login.intro.dialog_age"),
        info:$t("login.intro.dialog_age_info"),
        button1:$t("dialog.next"),
    })
    const {inputText: age_choice_dialog} = await dialog_age.show(player);
    let age_choice = age_choice_dialog;
    while(isNaN(Number(age_choice)) || Number(age_choice) < 16  || Number(age_choice) > 140){
        const {inputText: age_choice_dialog} = await dialog_age.show(player);
        age_choice = age_choice_dialog;
    }
    MPlayer.age = Number(age_choice);
    player.sendClientMessage(COLORS.WHITE, $t("login.intro.dialog_age_done", [age_choice]));
    performTutorial(player);
}

const TutorialLocations = [
    {
        "playerPos": {x:849.62371826172,y: -989.92199707031,z: -5.0},
        "cameraPos": {x:849.62371826172,y: -989.92199707031,z: 53.211112976074},
        "lookAt": {x:907.40313720703,y: -913.14117431641,z: 77.788856506348}
    },
    {
        "playerPos": {x:326.09194946289,y: -1521.3157958984,z: 20.0},
        "cameraPos": {x:398.16021728516,y: -1511.9237060547,z: 78.641815185547},
        "lookAt": {x:326.09194946289,y: -1521.3157958984,z: 42.154850006104}
    },
    {
        "playerPos": {"x": 1016.9872436523, "y": -1372.0234375, "z": -5.0},
        "cameraPos": {"x": 1053.3154296875, "y": -1326.3295898438, "z": 28.300031661987},
        "lookAt": {"x": 1016.9872436523, "y": -1372.0234375, "z": 15.836219787598}
    },
    {
        "playerPos": {"x": 1352.2797851563, "y": -1757.189453125, "z": -5.0},
        "cameraPos": {"x": 1352.4576416016, "y": -1725.1925048828, "z": 23.291763305664},
        "lookAt": {"x": 1352.2797851563, "y": -1757.189453125, "z": 13.5078125}
    },
    {
        "playerPos": {"x": 370.02825927734, "y": -2083.5886230469, "z": -10.0},
        "cameraPos": {"x": 340.61755371094, "y": -2091.701171875, "z": 22.800081253052},
        "lookAt": {"x": 370.02825927734, "y": -2083.5886230469, "z": 8.1386299133301}
    },
    {
        "playerPos": {"x": 1172.8602294922, "y": -1331.978515625, "z": -5.0},
        "cameraPos": {"x": 1228.7977294922, "y": -1345.1479492188, "z": 21.532119750977},
        "lookAt": {"x": 1172.8602294922, "y": -1331.978515625, "z": 14.317019462585}
    },
    {
        "playerPos": {"x": 412.80743408203, "y": -1312.4066162109, "z": -5.0},
        "cameraPos": {"x": 402.2776184082, "y": -1351.4703369141, "z": 43.704566955566},
        "lookAt": {"x": 412.80743408203, "y": -1312.4066162109, "z": 39.677307128906}
    }                  
]

function performTutorial(player: Player){
    player.toggleControllable(false);
    player.setVirtualWorld(0);
    const introText = pl_PL.login.tutorial.intro;
    for(const text in introText){
        let color;
        const validText = text as keyof typeof introText;
        const finalText: string = introText[validText];
        if(finalText.includes("|____")){
            color = COLORS.YELLOW;
        }else{
            color = COLORS.WHITE;
        }
        player.sendClientMessage(color, finalText);
    }
    let tutStep = 0;
    let intervalTime;
    if(process.env.DEV){
        intervalTime = 100;
    }else{
        intervalTime = 10000;
    }
    const tutInterval:number  = setInterval(()=>{
        if(tutStep == TutorialLocations.length){
            performSkinSelection(player);
            return clearInterval(tutInterval);
        }
        for(let i = 0; i < 10; i++){
            player.sendClientMessage(COLORS.WHITE, "");
        }
        player.setPos(TutorialLocations[tutStep].playerPos.x, TutorialLocations[tutStep].playerPos.y, TutorialLocations[tutStep].playerPos.z);
        player.setCameraPos(TutorialLocations[tutStep].cameraPos.x, TutorialLocations[tutStep].cameraPos.y, TutorialLocations[tutStep].cameraPos.z);
        player.setCameraLookAt(TutorialLocations[tutStep].lookAt.x, TutorialLocations[tutStep].lookAt.y, TutorialLocations[tutStep].lookAt.z, CameraCutStylesEnum.CUT);
        const currentTexts = (pl_PL.login.tutorial.parts as any)["part_"+tutStep] as { [key: string]: string }; //eslint-disable-line @typescript-eslint/no-explicit-any
        for(const text in currentTexts){
            let color;
            const validText = text as keyof typeof currentTexts;
            const finalText: string = currentTexts[validText];
            if(finalText.includes("|____")){
                color = COLORS.YELLOW;
            }else{
                color = COLORS.WHITE;
            }
            player.sendClientMessage(color, finalText);
        }
        tutStep++;
    }, intervalTime, tutStep)
}

function performSkinSelection(player: Player){
    for(let i = 0; i < 10; i++){
        player.sendClientMessage(COLORS.WHITE, "");
    }

    player.toggleSpectating(false);
    player.spawn();
    player.setInterior(1);
    player.setVirtualWorld(5151 + player.id);
    player.setPos(208.3876, -34.8742, 1001.9297);
    player.setFacingAngle(138.8926);
    player.setCameraPos(206.288314, -38.114028, 1002.229675);
    player.setCameraLookAt(208.775955, -34.981678, 1001.929687, CameraCutStylesEnum.CUT);
    player.sendClientMessage(COLORS.NEWS, $t("login.tutorial.select_skin"));
    console.log(SkinSelector["left"]);
    SkinSelector["left"].show(player);
    SkinSelector["right"].show(player);
    SkinSelector["select"].show(player);
    
    player.toggleControllable(false);
    player.selectTextDraw("rgba175, 175, 175)");

    setTimeout(() => {
        const MPlayer = getMPlayer(player);
        MPlayer.skinSelectorSkin = 0;
        const sex = MPlayer.sex;
        //@ts-expect-error Chuj wie czemu to pluje, jak ktoś się bardziej zna to kiedyś naprawi - póki co działa
        const skin = Skins[sex][0];
        player.setSkin(skin);
    }, 500); //Chuj wie czemu, ale inaczej nie ustawi się odpowiedni skin XD
}