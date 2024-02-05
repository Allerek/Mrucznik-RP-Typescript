import connection from "@/mysql/mysql";
import { Dialog, DialogStylesEnum, GameMode, Player, PlayerEvent, Vehicle } from "@infernus/core";
import { RowDataPacket } from "mysql2";
import { Coordinates, MVehicle, Vehicles } from "./classes/vehicle";
import { getMPlayer } from "@/login/classes/player";
import { $t } from "@/i18n";
import pl_PL from "../i18n/locales/pl-PL.json";

const vehicleNames: string[] = ["Landstalker", "Bravura", "Buffalo", "Linerunner", "Perennial", "Sentinel", "Dumper", "Fire Truck", "Trashmaster", "Stretch", "Manana", 
    "Infernus", "Voodoo", "Pony", "Mule", "Cheetah", "Ambulance", "Leviathan", "Moonbeam", "Esperanto", "Taxi", "Washington", "Bobcat", 
    "Mr. Whoopee", "BF Injection", "Hunter", "Premier", "Enforcer", "Securicar", "Banshee", "Predator", "Bus", "Rhino", "Barracks", "Hotknife", 
    "Trailer 1", "Previon", "Coach", "Cabbie", "Stallion", "Rumpo", "RC Bandit", "Romero", "Packer", "Monster", "Admiral", "Squalo", 
    "Seasparrow", "Pizzaboy", "Tram", "Trailer 2", "Turismo", "Speeder", "Reefer", "Tropic", "Flatbed", "Yankee", "Caddy", "Solair", 
    "Berkley's RC Van", "Skimmer", "PCJ-600", "Faggio", "Freeway", "RC Baron", "RC Raider", "Glendale", "Oceanic", "Sanchez", "Sparrow", "Patriot", 
    "Quadbike", "Coastguard", "Dinghy", "Hermes", "Sabre", "Rustler", "ZR-350", "Walton", "Regina", "Comet", "BMX", "Burrito", "Camper", "Marquis", 
    "Baggage", "Dozer", "Maverick", "News Chopper", "Rancher", "FBI Rancher", "Virgo", "Greenwood", "Jetmax", "Hotring Racer", "Sandking", 
    "Blista Compact", "Police Maverick", "Boxville", "Benson", "Mesa", "RC Goblin", "Hotring Racer 2", "Hotring Racer 3", "Bloodring Banger", 
    "Rancher Lure", "Super GT", "Elegant", "Journey", "Bike", "Mountain Bike", "Beagle", "Cropduster", "Stuntplane", "Tanker", "Roadtrain", "Nebula", 
    "Majestic", "Buccaneer", "Shamal", "Hydra", "FCR-900", "NRG-500", "HPV1000", "Cement Truck", "Towtruck", "Fortune", "Cadrona", "FBI Truck", 
    "Willard", "Forklift", "Tractor", "Combine Harvester", "Feltzer", "Remington", "Slamvan", "Blade", "Freight", "Brown Streak", "Vortex", "Vincent", 
    "Bullet", "Clover", "Sadler", "Fire Truck Ladder", "Hustler", "Intruder", "Primo", "Cargobob", "Tampa", "Sunrise", "Merit", "Utility Van", 
    "Nevada", "Yosemite", "Windsor", "Monster 2", "Monster 3", "Uranus", "Jester", "Sultan", "Stratum", "Elegy", "Raindance", "RC Tiger", "Flash", 
    "Tahoma", "Savanna", "Bandito", "Freight Train Flatbed", "Streak Train Trailer", "Kart", "Mower", "Dune", "Sweeper", "Broadway", "Tornado", 
    "AT-400", "DFT-30", "Huntley", "Stafford", "BF-400", "Newsvan", "Tug", "Trailer (Tanker Commando)", "Emperor", "Wayfarer", "Euros", "Hotdog", 
    "Club", "Box Freight", "Trailer 3", "Andromada", "Dodo", "RC Cam", "Launch", "Police LS", "Police SF", "Police LV", "Police Ranger", 
    "Picador", "S.W.A.T.", "Alpha", "Phoenix", "Glendale Damaged", "Sadler Damaged", "Baggage Trailer (covered)", 
    "Baggage Trailer (Uncovered)", "Trailer (Stairs)", "Boxville Mission", "Farm Trailer", "Street Clean Trailer"
];

type ParsedData = {
    x: string;
    y: string;
    z: string;
    rot: string;
};

GameMode.onInit(({next}) => {
    connection.query<RowDataPacket[]>("SELECT * FROM `mru_pojazdy`",(_err, rows) => {
        if(_err) throw _err;
        rows.forEach(row => {
            const parsedData: ParsedData[] = JSON.parse(row.parking_pos);
            const coordinatesArray: Coordinates[] = parsedData.map((item) => ({
                x: parseFloat(item.x),
                y: parseFloat(item.y),
                z: parseFloat(item.z),
                rot: parseFloat(item.rot),
              }));
            new MVehicle(row.id, row.model, row.owner_type, row.owner, coordinatesArray[0], row.color1, row.color2);
        })
    })
    next();
})

PlayerEvent.onCommandText("v", async ({player, subcommand, next})=>{
    if(subcommand[0] == "z" || subcommand[0] == "zamek"){
        const {veh, MVehicle} = findClosestVehicleToPlayer(player);
        console.log(veh, MVehicle);
        if(!veh || !MVehicle) return next();
        const params = veh.getParamsEx();
        const lock = params?.doors ? false : true;
        MVehicle.locked = lock;
        veh.setParamsEx(!!params?.engine, !!params?.lights, !!params?.alarm, lock, !!params?.bonnet, !!params?.boot, !!params?.objective);
        player.playSound(24600, 0, 0, 0);
        //Może kiedyś znajdzie się lepszy dźwięk
        // player.playSound(17006, 0, 0, 0);
        // setTimeout((player)=>{
        //     player.playSound(17006, 0, 0, 0);
        // },200, player);
    }else if(subcommand[0] == "list" || subcommand[0] == ""){
       showPlayerVehicleList(player);
    }
    return next();
})

async function showPlayerVehicleList(player: Player): Promise<void> {
    let listText:string = "";
    const Vehicles: MVehicle[] = getAllPlayerVehicles(player);
    for(const MVeh in Vehicles){
        const MVehicle = Vehicles[MVeh];
        listText = listText ? `${listText}\n${getVehicleNameFromModel(MVehicle.model)}(${MVehicle.id})` : `${getVehicleNameFromModel(MVehicle.model)}(${MVehicle.id})`;
    }
    const dialog = new Dialog({
        style: DialogStylesEnum.LIST,
        caption: $t("vehicles.list"),
        info: listText,
        button1: $t("dialog.ok"),
        button2: $t("dialog.cancel")
    })
    const {inputText: vehicle_dialog, response: response} = await dialog.show(player);
    const vehicle = vehicle_dialog;
    if(vehicle && response == 1){
        const match = vehicle.match(/\((\d+)\)/);
        if (match) {
            const vehicleId = parseInt(match[1], 10);
            let listText:string = "";
            const manage_options = pl_PL.vehicles.manage_menu;
            for(const option in manage_options){
                //@ts-expect-error Chuj wie czemu to pluje, jak ktoś się bardziej zna to kiedyś naprawi - póki co działa
                listText = listText ? `${listText}\n${manage_options[option]}` : `${manage_options[option]}`;
            }
            const dialog = new Dialog({
                style: DialogStylesEnum.LIST,
                caption: $t("vehicles.manage", [vehicleId]),
                info: listText,
                button1: $t("dialog.ok"),
                button2: $t("dialog.cancel")
            })
            const {inputText: vehicle_dialog, response: response} = await dialog.show(player);
            if(response == 0)  return showPlayerVehicleList(player);
            const vehicle = vehicle_dialog;
            if(vehicle){
                if(vehicle == $t("vehicles.manage_menu.spawn"))
                {
                    const MVehicle = getVehicleByUID(vehicleId);
                    if(MVehicle){
                        MVehicle.spawn();
                    }
                }else if(vehicle == $t("vehicles.manage_menu.unspawn")){
                    const MVehicle = getVehicleByUID(vehicleId);
                    if(MVehicle){
                        MVehicle.unspawn();
                    }
                }
            }
        }
    }
}

function getAllPlayerVehicles(player: Player): MVehicle[] {
    return Vehicles.filter(MVehicle => MVehicle.ownerType == 0 || MVehicle.owner == getMPlayer(player).id);
}

function getVehicleNameFromModel(model: number): string | undefined {
    return vehicleNames[model-400];
}

function findClosestVehicleToPlayer(player: Player): {veh: Vehicle | undefined, MVehicle: MVehicle | undefined} {
    let targetVehicle: Vehicle | undefined;
    let targetMVehicle: MVehicle | undefined;
    const playerPos = player.getPos();
    const MPlayer = getMPlayer(player);
    if(playerPos){
        for(const MVeh in Vehicles){
            const MVehicle = Vehicles[MVeh];
            const veh = MVehicle?.veh;
            if(!veh) continue;
            if(MVehicle.ownerType != 0 && MVehicle.owner != MPlayer.id) continue;
            const vehPos = veh.getPos();
            if(vehPos){
                const distance = player.getDistanceFromPoint(vehPos.x, vehPos.y, vehPos.z);
                if(!targetVehicle || distance < targetVehicle.getDistanceFromPoint(playerPos.x, playerPos.y, playerPos.z)){
                    targetVehicle = veh;
                    targetMVehicle = MVehicle;
                }
            }
        }
    }
    return {veh:targetVehicle,MVehicle: targetMVehicle};
}

export function getVehicleByUID(uid: number): MVehicle | undefined {
    for(const MVeh in Vehicles){
        const MVehicle = Vehicles[MVeh];
        if(MVehicle.id == uid) return MVehicle;
    }
    return undefined;
}