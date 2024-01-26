const bcrypt = require('bcryptjs');
let {Players, MPlayer} = require("./classes/player");
const {OnPlayerConnect, OnDialogResponse, DIALOG_STYLE, SampPlayer, ShowPlayerDialog} = require("samp-node-lib");
const { COLORS } = require('../definitions/colors');
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
            player.SendClientMessage(COLORS.WHITE, "Witaj na serwerze Mrucznik Role Play, "+name+"! Zaloguj sie aby rozpoczac gre!");
            const string = "Nick "+name+" jest zarejestrowany. \nZaloguj sie wpisujac w okienko ponizej haslo. \nJesli nie znasz hasla do tego konta, wejdz pod innym nickiem.";
            player.ShowPlayerDialog(1, DIALOG_STYLE.PASSWORD, "Logowanie", string, "Zaloguj", "Wyjdz");
        }else{//Nie ma takiego konta
            player.SendClientMessage(COLORS.YELLOW, "Witaj na serwerze Mrucznik Role Play, "+name+"! Zarejestruj swoje konto aby rozpoczac gre!");
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
                            player.SendClientMessage(COLORS.WHITE, "Witaj na serwerze Mrucznik Role Play "+name+"!");
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
                        player.SendClientMessage(COLORS.WHITE, "Wystąpił błąd związany z rejestracją, połącz się ponownie lub skonsultuj z administratorem!");
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
                        player.SendClientMessage(COLORS.NEWS, "Twoja postac jest mezczyzna");
                        break;
                    }
                case 1:
                    {
                        player.SendClientMessage(COLORS.NEWS, "Twoja postac jest kobieta");
                        break;
                    }
            }
            player.ShowPlayerDialog(72, DIALOG_STYLE.LIST, "Wybierz pochodzenie",  "USA\nEuropa\nAzja", "Dalej", "Wstecz");
            console.log(Players, Players[player.playerid]);
            Players[player.playerid].sex = listitem;
        }else{
            player.SendClientMessage(COLORS.YELLOW, "Witaj na serwerze Mrucznik Role Play, "+name+"! Zarejestruj swoje konto aby rozpoczac gre!");
            player.ShowPlayerDialog(70, DIALOG_STYLE.MSGBOX, "Witaj na Mrucznik Role Play", "Witaj na serwerze Mrucznik Role Play\nJesli jestes tu nowy, to przygotowalismy dla ciebie poradnik\nZa chwile bedziesz mogl go obejrzec, lecz najpierw bedziesz musial opisac postac ktora bedziesz sterowac\nAby przejsc dalej wcisnij przycisk 'dalej'", "Dalej", "");        }
    }else if (dialog == 72){
        if(response == 1){
            switch(listitem)
            {
                case 0://Usa
                    {
                        player.SendClientMessage(COLORS.NEWS, "Twoja postac jest obywatelem USA");
                        break;
                    }
                case 1:
                    {
                        player.SendClientMessage(COLORS.NEWS, "Twoja postac jest europejskim imigrantem.");
                        break;
                    }
                case 2:
                    {
                        player.SendClientMessage(COLORS.NEWS, "Twoja postac jest azjatyckim imigrantem.");
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
                    player.SendClientMessage(COLORS.NEWS, "Twoja postac ma "+inputtext+" lat(a)");
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
            player.SendClientMessage(COLORS.YELLOW, "Witaj na Mrucznik Role Play serwer.");
            player.SendClientMessage(COLORS.WHITE, "Nie jest to serwer Full-RP ale obowiazuja tu podstawowe zasady RP.");
            player.SendClientMessage(COLORS.WHITE, "Jesli ich nie znasz przyblize ci najwazniejsze zasady.");
            player.SendClientMessage(COLORS.LIGHTBLUE, "Obowiazuje absolutny zakaz Death-Match'u(DM).");
            player.SendClientMessage(COLORS.WHITE, "Co to jest DM? To zabijanie graczy na serwerze bez konkretnego powodu.");
            player.SendClientMessage(COLORS.WHITE, "Chodzi o to ze w prawdziwym zyciu, nie zabijalbys wszystkich dookola.");
            player.SendClientMessage(COLORS.WHITE, "Wiec jesli chcesz kogos zabic, musisz miec wazny powod.");
            player.SendClientMessage(COLORS.WHITE, "Ok, znasz juz najwazniejsze zasady, reszte poznasz pozniej.");
            let TutStep = 0;
            var tutInterval = setInterval(()=> {
                switch(TutStep)
                {
                    case 0:
                        {
                            for(let i=0; i<15; i++)
                            {
                                player.SendClientMessage(COLORS.WHITE, "")
                            }
                            player.SetPlayerPos(849.62371826172, -989.92199707031, -5.0);
                            player.SetPlayerCameraPos(849.62371826172, -989.92199707031, 53.211112976074);
                            player.SetPlayerCameraLookAt(907.40313720703, -913.14117431641, 77.788856506348); 
                            player.SendClientMessage(COLORS.PURPLE, "|____ Tutorial: Poczatek ____|");
                            player.SendClientMessage(COLORS.WHITE, "Ooo... nowy na serwerze.... wiec musisz o czyms wiedziec.");
                            player.SendClientMessage(COLORS.WHITE, "Jest to serwer Role Play(RP). Role Playing to odzwierciedlanie realnego zycia w grze.");
                            player.SendClientMessage(COLORS.WHITE, "Skoro juz wiesz, co to jest Role Play musisz poznac zasady panujace na naszym serwerze.");
                            player.SendClientMessage(COLORS.WHITE, "W tym celu przejdziesz teraz drobny samouczek tekstowy, ktory przygotuje Cie do rozgrywki!");                            
                            TutStep = 1;     
                            break;      
                        }
                    case 1:
                        {
                            for(let i=0; i<15; i++)
                            {
                                player.SendClientMessage(COLORS.WHITE, "")
                            }
                            player.SetPlayerPos(326.09194946289, -1521.3157958984, 20.0);
                            player.SetPlayerCameraPos(398.16021728516, -1511.9237060547, 78.641815185547);
                            player.SetPlayerCameraLookAt(326.09194946289, -1521.3157958984, 42.154850006104);
                            player.SendClientMessage(COLORS.PURPLE, "|____ Tutorial: zasady serwera - DM i Nick ____|");
                            player.SendClientMessage(COLORS.WHITE, "Na serwerze obowiazuje absolutny zakaz jakiegokolwiek DeathMatch`u(DM).");
                            player.SendClientMessage(COLORS.WHITE, "Nie chcemy na serwerze osob ktore bezmyslnie zabijaja wszystko co sie rusza.");
                            player.SendClientMessage(COLORS.WHITE, "Chodzi o to, ze w prawdziwym zyciu, nie zabijalbys wszystkich dookola.");
                            player.SendClientMessage(COLORS.WHITE, "Wiec jesli chcesz kogos zabic, musisz miec naprawde wazny powod.");
                            player.SendClientMessage(COLORS.WHITE, "Na serwerze trzeba miec nick typu Imie_Nazwisko (np. Jan_Kowalski)");
                            player.SendClientMessage(COLORS.WHITE, "Jeeli masz inny nick niz Imie_Nazwisko to popros admina o zmiane go.");
                            TutStep = 2;
                            break;
                        }
                    case 2:
                        {
                            for(let i=0; i<15; i++)
                            {
                                player.SendClientMessage(COLORS.WHITE, "")
                            }
                            player.SetPlayerPos(1016.9872436523, -1372.0234375, -5.0);
                            player.SetPlayerCameraPos(1053.3154296875, -1326.3295898438, 28.300031661987);
                            player.SetPlayerCameraLookAt(1016.9872436523, -1372.0234375, 15.836219787598);
                            player.SendClientMessage(COLORS.PURPLE,  "|____ Tutorial: zasady serwera - Bug Using i cheatowanie ____|");
                            player.SendClientMessage(COLORS.WHITE, "Jesli widzisz, ze ktos cheatuje, powiadom administratorow przez komende /report.");
                            player.SendClientMessage(COLORS.WHITE, "Nie wolno uzywac Bugow (np. znasz jakiegos buga, ktory daje ci kase).");
                            player.SendClientMessage(COLORS.WHITE, "Jesli masz czity, wylacz je i idz na jakis inny serwer. Tu nie mozna czitowac.");
                            player.SendClientMessage(COLORS.WHITE, "Osoba korzystajaca z Cheatow i Bugow moze zostac zbanowana lub ostrzezona.");
                            TutStep = 3;
                            break;
                        }
                    case 3:
                        {
                            for(let i=0; i<15; i++)
                            {
                                player.SendClientMessage(COLORS.WHITE, "")
                            }
                            player.SetPlayerPos(1352.2797851563, -1757.189453125, -5.0);
                            player.SetPlayerCameraPos(1352.4576416016, -1725.1925048828, 23.291763305664);
                            player.SetPlayerCameraLookAt(1352.2797851563, -1757.189453125, 13.5078125);
                            player.SendClientMessage(COLORS.PURPLE,  "|____ Tutorial: zasady Serwera - OOC i IC ____|");
                            player.SendClientMessage(COLORS.WHITE, "A wiec musisz wiedziec co to jest OOC i IC, oraz poprawnie to interpretowac.");
                            player.SendClientMessage(COLORS.WHITE, "Ta zasada jest bardzo wazna, wiec czytaj uwaznie, oraz zapamietaj to.");
                            player.SendClientMessage(COLORS.WHITE, "OOC to wszystko co NIE JEST zwiazane z twoja postacia. (np. twoja szkola).");
                            player.SendClientMessage(COLORS.WHITE, "OOC to wszystkie rzeczy zwiazane z toba w realu, oraz z komendami, adminami itp.");
                            player.SendClientMessage(COLORS.WHITE, "Rzeczy OOC piszemy w chatach: /b /o /i oraz /ro i /depo");
                            player.SendClientMessage(COLORS.WHITE, "Poprawnie napisany tekst OOC: /b elo, jestes adminem? /b jak tam w szkole? itp.");
                            TutStep = 4;
                            break;
                        }
                    case 4:
                        {
                            for(let i=0; i<15; i++)
                            {
                                player.SendClientMessage(COLORS.WHITE, "")
                            }
                            player.SetPlayerPos(370.02825927734, -2083.5886230469, -10.0);
                            player.SetPlayerCameraPos(340.61755371094, -2091.701171875, 22.800081253052);
                            player.SetPlayerCameraLookAt(370.02825927734, -2083.5886230469, 8.1386299133301);
                            player.SendClientMessage(COLORS.PURPLE,  "|____ Tutorial: zasady serwera - IC ____|");
                            player.SendClientMessage(COLORS.WHITE, "IC to tak jakby przeciwnosc OOC. To wszystko co JEST zwiazane z twoja postacia.");
                            player.SendClientMessage(COLORS.WHITE, "Musisz tez wiedziec co to jest IC, oraz poprawnie to interpretowac.");
                            player.SendClientMessage(COLORS.WHITE, "Rzeczy IC piszemy w chatach: /l /s /k /t /ad oraz w zwyklym chacie itp.");
                            player.SendClientMessage(COLORS.WHITE, "Poprawnie napisany tekst IC: /l witam pana /k stoj policja, rece do gory! itp.");
                            TutStep = 5;
                            break;
                        }
                    case 5:
                        {
                            for(let i=0; i<15; i++)
                            {
                                player.SendClientMessage(COLORS.WHITE, "")
                            }
                            player.SetPlayerPos(1172.8602294922, -1331.978515625, -5.0);
                            player.SetPlayerCameraPos(1228.7977294922, -1345.1479492188, 21.532119750977);
                            player.SetPlayerCameraLookAt(1172.8602294922, -1331.978515625, 14.317019462585);
                            player.SendClientMessage(COLORS.PURPLE, "|____ Tutorial: zasady serwera - MG i PG ____|");
                            player.SendClientMessage(COLORS.WHITE, "MG (MetaGaming) - to wykorzystywanie informacji OOC do IC.");
                            player.SendClientMessage(COLORS.WHITE, "Czyli widzisz nick nad glowa gracza i mowisz do niego na chacie IC po imieniu");
                            player.SendClientMessage(COLORS.WHITE, "Lub wtedy gdy ktos mowi na /b jestem liderem LCN, a ty sie go pytasz o prace w LCN");
                            player.SendClientMessage(COLORS.WHITE, "PG - to zmuszanie kogos do akcji RP, mimo iz ta osoba tego nie chce.");
                            player.SendClientMessage(COLORS.WHITE, "Czyli np. ktos podchodzisz do ktos i dajesz /me bije Johna tak, ze umiera, to jest PG.");                                                      
                            TutStep = 6;
                            break;
                        }
                    case 6:
                        {
                            for(let i=0; i<15; i++)
                            {
                                player.SendClientMessage(COLORS.WHITE, "")
                            }
                            const name = player.GetPlayerName(24);
                            player.SetPlayerPos(412.80743408203, -1312.4066162109, -5.0);
                            player.SetPlayerCameraPos(402.2776184082, -1351.4703369141, 43.704566955566);
                            player.SetPlayerCameraLookAt(412.80743408203, -1312.4066162109, 39.677307128906);
                            player.SendClientMessage(COLORS.PURPLE, "|____ Tutorial: zakonczenie ____|");
                            player.SendClientMessage(COLORS.WHITE, "Masz sie trzymac wymienionych zasad zrozumiano?.");
                            player.SendClientMessage(COLORS.WHITE, "Po prostu pamietaj o nich i ciesz sie gra, a jak nie... ");
                            player.SendClientMessage(COLORS.WHITE, "Zapewne masz jeszcze sporo pytan dotyczacych gry. Spokojnie, znajdziesz na nie odpowiedz!");
                            player.SendClientMessage(COLORS.WHITE, "Mozesz smialo pytac administratora (/admins), poprzez zapytania (/zapytaj), badz tez [.]");
                            player.SendClientMessage(COLORS.WHITE, "[.] poprzez chat dla nowych graczy /newbie. To juz koniec samouczka. ");
                            player.SendClientMessage(COLORS.WHITE, "Zasad, poradnikow i pomocy jest znacznie wiecej na naszym forum! Odwiedz je: https://mrucznik-rp.pl");                                        
                            TutStep = 7;
                            Players[player.playerid].ConnectedTime = 1;
                            pool.query("UPDATE `mru_konta` SET `ConnectedTime` = 1 WHERE `Nick` = ? ", [name], function(){
                                console.log("Udało się?");
                            });
                            Players[player.playerid].spawnPlayer();
                            player.SetPlayerPos(0,0,3);
                            break;
                        }
                }
                if (TutStep == 7){
                    clearInterval(tutInterval);
                }
            },10000)
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
        player.SendClientMessage(COLORS.WHITE, "Aby zaczac gre musisz przejsc procedury rejestracji.");
        player.ShowPlayerDialog(70, DIALOG_STYLE.MSGBOX, "Witaj na Mrucznik Role Play", "Witaj na serwerze Mrucznik Role Play\nJesli jestes tu nowy, to przygotowalismy dla ciebie poradnik\nZa chwile bedziesz mogl go obejrzec, lecz najpierw bedziesz musial opisac postac ktora bedziesz sterowac\nAby przejsc dalej wcisnij przycisk 'dalej'", "Dalej", "");
    }
}
