const {
    SpawnPlayer,
    SetPlayerSkin,
    GivePlayerMoney,
    TogglePlayerSpectating,
    ResetPlayerMoney,
    SetPlayerPos,
    OnPlayerConnect,
    OnPlayerText
} = require("samp-node-lib");

Players = {}
//Klasa gracza - wygodne przechowywanie danych
class MPlayer {
    constructor(id, player, name, surName, money, skin, connectTimes) {
        this.id = id;
        this.playerid = player.playerid;
        this.name = name;
        this.surName = surName;
        this.money = money;
        this.skin = skin;
        this.connectTimes = connectTimes;
        this.sex;
        this.origin;
        this.age;
        this.gagged = (this.gagged === undefined) ? false : gagged;
        this.loggedIn;
        Players[player] = this;
        if (connectTimes >= 1) {
            this.spawnPlayer();
        }

    }

    /**
     * Spawns the player and performs various actions.
     * - Sets the player skin.
     * - Resets the player's money.
     * - Gives the player money.
     * - Sets the player's position.
     */
    spawnPlayer() {
        // TODO: Add weapon giving and other similar actions.

        // Disable player spectating and spawn the player.
        TogglePlayerSpectating(this.playerid, 0);
        SpawnPlayer(this.playerid);

        // Set the player's skin and reset their money.
        SetPlayerSkin(this.playerid, this.skin);
        ResetPlayerMoney(this.playerid);

        // Give the player money and set their position.
        GivePlayerMoney(this.playerid, this.money);
        SetPlayerPos(this.playerid, 1742.9498, -1860.8604, 13.5782);
    }

    /**
     * Get the full name if fullName=tr, otherwise return an object with the name and surname.
     * @param {string} fullName - The full name to check
     * @returns {string|object} - The full name if fullName=true, otherwise an object with the name and surname
     */
    getName(fullName) {
        if (fullName) {
            return `${this.name} ${this.surName}`;
        } else {
            return {
                name: this.name,
                surName: this.surName
            };
        }
    }

    setLoggedIn(bool) {
        this.loggedIn = bool;
    }

    /**
     * Set the gagged status of the player
     * @param {boolean} bool - The new gagged status
     */
    setGagged(bool) {
        this.gagged = bool;
    }

    setOrigin(origin) {
        this.origin = origin;
    }

    setAge(age) {
        this.age = age;
    }

    setSkin(skin) {
        this.skin = skin;
    }

    /**
     * Set the sex of the person.
     * @param {string} sex - The sex to be set.
     */
    setSex(sex) {
        this.sex = sex;
    }

    /**
     * Adds money to the player's account and notifies the player.
     * 
     * @param {number} money - The amount of money to add.
     */
    giveMoney(money) {
        this.money += money; // Add money to player's account
        GivePlayerMoney(this.playerid, money); // Notify the player about the money added
    }
}

    function getPlayerList()
    {
        return Players;
    }

    function getPlayerById(id)
    {
        for(let i in Players)
        {
            if(Players[i].playerid == id)
            {
                console.log("Found player: " + Players[i]);
                return Players[i];
            }
        }
    }
 
module.exports = {
    Players,
    MPlayer,
    getPlayerList,
    getPlayerById
}

