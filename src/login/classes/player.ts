import { Player } from "@infernus/core";
const Players: MPlayer[] = [];
/* The MPlayer class represents a player in a game and stores their information such as id, name,
money, skin, etc. */
export class MPlayer{
    id: number;
    playerid: number;
    player: Player;
    _name: string;
    _surName: string;
    _money: number;
    _skin: number;
    _connectTime: number;
    _sex: number;
    _origin: number;
    _age: number;
    gagged: boolean;
    duty: boolean;
    _loggedIn: boolean;
    _skinSelectorSkin: number;
    /**
     * Constructor for creating a new Player object.
     *
     * @param {number} id - the unique identifier for the player
     * @param {Player} player - the player object
     * @param {string} name - the name of the player
     * @param {string} surName - the surname of the player
     * @param {number} money - the amount of money the player has
     * @param {number} skin - the skin number of the player
     * @param {number} connectTime - the time of connection for the player
     * @return {void} 
     */
    constructor(id: number, player: Player, name: string, surName: string, money: number, skin: number, connectTime: number){
        this.id = id;
        this.playerid = player.id;
        this.player = player;
        this._name = name;
        this._surName = surName;
        this._money = money;
        this._skin = skin;
        this._connectTime = connectTime;
        this._sex = 0;
        this._origin = 0;
        this._age = 0;
        this.gagged = false;
        this.duty = false;
        this._loggedIn = false;
        this._skinSelectorSkin = 0;
        Players.push(this);
    }

    set skinSelectorSkin(value: number){
        this._skinSelectorSkin = value;
    }

    get skinSelectorSkin(): number{
        return this._skinSelectorSkin;
    }

    set loggedIn(value: boolean){
        this._loggedIn = value;
    }

    set connectTime(value: number){
        this._connectTime = value;
    }

    set name(value: string){
        this._name = value;
    }
    
    get name(): string{
        return this._name;
    }

    set surName(value: string){
        this._surName = value;
    }

    get surName(): string{
        return this._surName;
    }

    set money(value: number){
        this._money = value;
    }

    get money(): number{
        return this._money;
    }

    set skin(value: number){
        this._skin = value;
    }

    get skin(): number{
        return this._skin;
    }

    set age(value: number){
        this._age = value;
    }

    set sex(value: number){
        this._sex = value;
    }

    get sex(): number{
        return this._sex;
    }

    set origin(value: number){
        this._origin = value;
    }

    spawnPlayer()
    {
        this.player.toggleSpectating(false);
        this.player.spawn();

        this.player.setSkin(this._skin);
        this.player.resetMoney();
        this.player.giveMoney(this._money);

        //TODO: ustalanie spawnu
        this.player.setPos(1742.9498, -1860.8604, 13.5782);
    }
}

export function getMPlayerById(id: number){
    return Players[id];
}

export function getMPlayer(player: Player){
    return Players[player.id];
}