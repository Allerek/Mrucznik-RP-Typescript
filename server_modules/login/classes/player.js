const { SpawnPlayer, SetPlayerSkin, GivePlayerMoney, TogglePlayerSpectating, ResetPlayerMoney } = require("samp-node-lib");

//Klasa gracza - wygodne przechowywanie danych
Players = {} // Indexem jest playerid, wartością jest obiekt gracza
class MPlayer {
    constructor(playerid, name, surName, money, skin, connectTimes){
        this.playerid = playerid;
        this.name = name;
        this.surName = surName;
        this.money = money;
        this.skin = skin;
        this.connectTimes = connectTimes;
        this.sex;
        this.origin;
        this.age;
        if(connectTimes >= 1)
        {
            TogglePlayerSpectating(playerid, 0);
            SpawnPlayer(playerid);
            SetPlayerSkin(playerid, skin);
            GivePlayerMoney(playerid, money);
        }
    }

    spawnPlayer()
    {
        TogglePlayerSpectating(this.playerid, 0);
        SpawnPlayer(this.playerid);
        SetPlayerSkin(this.playerid, this.skin);
        ResetPlayerMoney(this.playerid)
        GivePlayerMoney(this.playerid, this.money);
    }

    giveMoney(money){
        this.money += money;
        GivePlayerMoney(this.playerid, money);
    }
}



module.exports = {Players, MPlayer}