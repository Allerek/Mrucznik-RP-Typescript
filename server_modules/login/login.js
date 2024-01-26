const bcrypt = require('bcryptjs');
let {Players, MPlayer} = require("./classes/player");
const {OnPlayerConnect, OnDialogResponse, DIALOG_STYLE, SampPlayer, ShowPlayerDialog} = require("samp-node-lib");
const saltRounds = 10;
console.log(MPlayer);

const pool = require("../mysql/mysql").pool; //Obiekt połączenia MySQL


console.log("test");

OnPlayerConnect((player) => {
    const name = player.GetPlayerName(24);
    player.TogglePlayerSpectating(1);
    console.log(name+" has joined the server.");
    pool.query('SELECT Nick FROM `mru_konta` WHERE `Nick` = ? LIMIT 1', [name], function (error, results, fields) {
        if (results && results.length > 0)  {//Jest takie konto
            player.SendClientMessage("rgba(255,255,255,1)", "Witaj na serwerze Mrucznik Role Play, "+name+"! Zaloguj sie aby rozpoczac gre!");
            const string = "Nick "+name+" jest zarejestrowany. \nZaloguj sie wpisujac w okienko ponizej haslo. \nJesli nie znasz hasla do tego konta, wejdz pod innym nickiem.";
            player.ShowPlayerDialog(1, DIALOG_STYLE.PASSWORD, "Logowanie", string, "Zaloguj", "Wyjdz");
        }else{//Nie ma takiego konta
            player.SendClientMessage("rgba(255, 255, 0, 1)", "Witaj na serwerze Mrucznik Role Play, "+name+"! Zarejestruj swoje konto aby rozpoczac gre!");
            player.ShowPlayerDialog(2, DIALOG_STYLE.INPUT, "Rejestracja konta", "Witaj. Aby zaczac gre na serwerze musisz sie zarejestrowac.\nAby to zrobic wpisz w okienko ponizej haslo ktore chcesz uzywac w swoim koncie.\nZapamietaj je gdyz bedziesz musial go uzywac za kazdym razem kiedy wejdziesz na serwer", "Rejestruj", "Wyjdz");
        }
    });
});

OnDialogResponse((player, dialog, response, listitem, inputtext) => {
    if (dialog == 1 && response == 1){//Logowanie
        //TODO: Sprawdź bany itd itp
        const name = player.GetPlayerName(24);
        if(player.IsPlayerConnected() == 1){
            pool.query('SELECT * FROM `mru_konta` WHERE `Nick` = ? LIMIT 1', [name], function (error, results, fields) {
                bcrypt.compare(inputtext, results[0].password).then(function(result) {
                    if(result){//hasło się zgadza
                        console.log(name+" logged in.");
                        if(results[0].ConnectedTime == 0){
                            const splitName = name.split("_");
                            performIntro(player, results[0].ConnectedTime);
                            Players[player.playerid] = new MPlayer(player.playerid, splitName[0], splitName[1], results[0].Money, results[0].Skin, results[0].ConnectedTime);
                        }else{
                            const splitName = name.split("_");
                            Players[player.playerid] = new MPlayer(player.playerid, splitName[0], splitName[1], results[0].Money, results[0].Skin, results[0].ConnectedTime);
                            player.SetPlayerPos(0,0,3);
                            player.SendClientMessage("rgba(255,255,255,1)", "Witaj na serwerze Mrucznik Role Play "+name+"!");
                        }
                    }
                });
            });
        }
    }else if(dialog == 2 && response == 1) {
        //TODO: Min/Max długość hasła 
        const name = player.GetPlayerName(24);
        if(player.IsPlayerConnected() == 1){
           bcrypt.hash(inputtext, 10).then(function(result){
                pool.query("INSERT INTO `mru_konta` (`Nick`, `password`) VALUES(?,?)", [name, result], function(error, _, __) {
                    if (error) {
                        console.log(error);
                        player.SendClientMessage("rgba(255,255,255,1)", "Wystąpił błąd związany z rejestracją, połącz się ponownie lub skonsultuj z administratorem!");
                        player.Kick();
                    }else{
                        pool.query('SELECT * FROM `mru_konta` WHERE `Nick` = ? LIMIT 1', [name], function (error, results, fields) {
                            if(result){
                                console.log(name+" registered.");
                                const splitName = name.split("_");
                                Players[player.playerid] = new MPlayer(player.playerid, splitName[0], splitName[1], results[0].Money, results[0].Skin, 0);
                                player.SetPlayerPos(0,0,3);
                            }
                        });
                    }
                })
           })
        }
    }else if((dialog == 1 || dialog == 2) && response == 0){//wyjście z logowania/rejestracji
        player.Kick();
    }else if (dialog == 70){
        player.ShowPlayerDialog(71, DIALOG_STYLE.LIST, "Wybierz plec", "Mezczyzna\nKobieta", "Dalej", "Wstecz");
    }else if (dialog == 71){
        if(response == 1){
            switch(listitem)
            {
                case 0://Facet
                    {
                        player.SendClientMessage("rgba(255, 165, 0)", "Twoja postac jest mezczyzna");
                        break;
                    }
                case 1:
                    {
                        player.SendClientMessage("rgba(255, 165, 0)", "Twoja postac jest kobieta");
                        break;
                    }
            }
            player.ShowPlayerDialog(72, DIALOG_STYLE.LIST, "Wybierz pochodzenie",  "USA\nEuropa\nAzja", "Dalej", "Wstecz");
            console.log(Players, Players[player.playerid]);
            Players[player.playerid].sex = listitem;
        }else{
            player.SendClientMessage("rgba(255, 255, 0, 1)", "Witaj na serwerze Mrucznik Role Play, "+name+"! Zarejestruj swoje konto aby rozpoczac gre!");
            player.ShowPlayerDialog(70, DIALOG_STYLE.MSGBOX, "Witaj na Mrucznik Role Play", "Witaj na serwerze Mrucznik Role Play\nJesli jestes tu nowy, to przygotowalismy dla ciebie poradnik\nZa chwile bedziesz mogl go obejrzec, lecz najpierw bedziesz musial opisac postac ktora bedziesz sterowac\nAby przejsc dalej wcisnij przycisk 'dalej'", "Dalej", "");        }
    }else if (dialog == 72){
        if(response == 1){
            switch(listitem)
            {
                case 0://Usa
                    {
                        player.SendClientMessage("rgba(255, 165, 0)", "Twoja postac jest obywatelem USA");
                        break;
                    }
                case 1:
                    {
                        player.SendClientMessage("rgba(255, 165, 0)", "Twoja postac jest europejskim imigrantem.");
                        break;
                    }
                case 2:
                    {
                        player.SendClientMessage("rgba(255, 165, 0)", "Twoja postac jest azjatyckim imigrantem.");
                        break;
                    } 
            }
            player.ShowPlayerDialog(73, DIALOG_STYLE.INPUT, "Wybierz wiek postaci", "Wpisz wiek swojej postaci (od 16 do 140 lat)", "Dalej", "Wstecz");
            Players[player.playerid].origin = listitem;
        }else{
            player.ShowPlayerDialog(71, DIALOG_STYLE.LIST, "Wybierz plec", "Mezczyzna\nKobieta", "Dalej", "Wstecz");
        }
    }else if (dialog == 73){
        if(response == 1){
            if(inputtext.length > 1 && inputtext.length < 4){
                if(inputtext >= 16 && inputtext <= 140){
                    player.SendClientMessage("rgba(255, 165, 0)", "Twoja postac ma "+inputtext+" lat(a)");
                    Players[player.playerid].age = inputtext;
                    player.ShowPlayerDialog(74, DIALOG_STYLE.MSGBOX, "Samouczek", "To juz wszystkie dane jakie musiales podac. Teraz musisz przejsc samouczek.\nAby go rozpoczac wcisnij 'dalej'", "Dalej", "Wstecz");
                } else{
                    player.ShowPlayerDialog(73, DIALOG_STYLE.INPUT, "Wybierz wiek postaci", "Wpisz wiek swojej postaci (od 16 do 140 lat)", "Dalej", "Wstecz");
                }
            }else {
                player.ShowPlayerDialog(73, DIALOG_STYLE.INPUT, "Wybierz wiek postaci", "Wpisz wiek swojej postaci (od 16 do 140 lat)", "Dalej", "Wstecz");
            }
        }else {
            player.ShowPlayerDialog(72, DIALOG_STYLE.LIST, "Wybierz pochodzenie",  "USA\nEuropa\nAzja", "Dalej", "Wstecz");
        }
    }else if (dialog == 74){
        if(response == 1){
            player.TogglePlayerControllable(0);
            player.SetPlayerVirtualWorld(0);
            player.SendClientMessage("rgba(255,255,0,1)", "Witaj na Mrucznik Role Play serwer.");
            player.SendClientMessage("rgba(255,255,255,1)", "Nie jest to serwer Full-RP ale obowiazuja tu podstawowe zasady RP.");
            player.SendClientMessage("rgba(255,255,255,1)", "Jesli ich nie znasz przyblize ci najwazniejsze zasady.");
            player.SendClientMessage("rgba(51,204,255,1)", "Obowiazuje absolutny zakaz Death-Match'u(DM).");
            player.SendClientMessage("rgba(255,255,255,1)", "Co to jest DM? To zabijanie graczy na serwerze bez konkretnego powodu.");
            player.SendClientMessage("rgba(255,255,255,1)", "Chodzi o to ze w prawdziwym zyciu, nie zabijalbys wszystkich dookola.");
            player.SendClientMessage("rgba(255,255,255,1)", "Wiec jesli chcesz kogos zabic, musisz miec wazny powod.");
            player.SendClientMessage("rgba(255,255,255,1)", "Ok, znasz juz najwazniejsze zasady, reszte poznasz pozniej.");
        }else if(response == 0){
            player.ShowPlayerDialog(73, DIALOG_STYLE.INPUT, "Wybierz wiek postaci", "Wpisz wiek swojej postaci (od 16 do 140 lat)", "Dalej", "Wstecz");
        }
    }
})

//Samouczek itp itd, ogolem pierdolenie o szopenie https://github.dev/Allerek/Mrucznik-RP-2.5/blob/d6be510b9968d3a565e593494c910f3c69943ca7/gamemodes/Mrucznik-RP.pwn#L6081
function performIntro(player, ConnectedTime){
    if(!typeof(player) == SampPlayer) return;
    if(ConnectedTime > 0 ){
        //zespawnuj
    }else{
        player.SendClientMessage("rgba(255,240,0,1)", "Witaj na Mrucznik Role Play!");
        player.SendClientMessage("rgba(255,255,255,1)", "Aby zaczac gre musisz przejsc procedury rejestracji.");
        player.ShowPlayerDialog(70, DIALOG_STYLE.MSGBOX, "Witaj na Mrucznik Role Play", "Witaj na serwerze Mrucznik Role Play\nJesli jestes tu nowy, to przygotowalismy dla ciebie poradnik\nZa chwile bedziesz mogl go obejrzec, lecz najpierw bedziesz musial opisac postac ktora bedziesz sterowac\nAby przejsc dalej wcisnij przycisk 'dalej'", "Dalej", "");
    }
}
