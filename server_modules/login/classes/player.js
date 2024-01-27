const { SpawnPlayer, SetPlayerSkin, GivePlayerMoney, TogglePlayerSpectating, ResetPlayerMoney, SetPlayerPos, SetPlayerFacingAngle } = require("samp-node-lib");

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
            this.spawnPlayer();
        }
    }

    spawnPlayer()
    {  
        TogglePlayerSpectating(this.playerid, 0);
        SpawnPlayer(this.playerid);
        SetPlayerSkin(this.playerid, this.skin);
        ResetPlayerMoney(this.playerid)
        GivePlayerMoney(this.playerid, this.money);

        //TODO: https://github.com/Allerek/Mrucznik-RP-2.5/blob/1a0df3ba8575cd6d2c8084f614cd9be693ce2a90/gamemodes/Mrucznik-RP.pwn#L2247-L2248
        SetPlayerPos(this.playerid, 1742.9498, -1860.8604, 13.5782);

    }

    giveMoney(money){
        this.money += money;
        GivePlayerMoney(this.playerid, money);
    }
}



module.exports = {Players, MPlayer}