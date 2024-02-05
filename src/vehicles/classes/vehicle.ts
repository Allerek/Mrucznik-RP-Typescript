import { Vehicle } from "@infernus/core";
import { getVehicleByUID } from "../vehicles";

export type Coordinates = {
    x: number;
    y: number;
    z: number;
    rot: number;
};
  
export const Vehicles: MVehicle[] = [];

export class MVehicle {

    _id: number;
    _model: number;
    _vehPos: Coordinates;
    _color1: number;
    _color2: number;
    _veh: Vehicle | undefined;
    _locked: boolean;
    _ownerType: number;
    _owner: number;
    constructor(id: number, model: number, ownerType: number, owner:number, vehPos: Coordinates, color1: number, color2: number)
    {
        this._id = id;
        this._model = model;
        this._vehPos = vehPos;
        this._color1 = color1;
        this._color2 = color2;
        this._locked = true;
        this._ownerType = ownerType;
        this._owner = owner;

        const x:number = vehPos.x;
        const y:number = vehPos.y;
        const z:number = vehPos.z;
        const rot:number = vehPos.rot;
        const veh = new Vehicle({
            modelId: model,
            x: x,
            y: y,
            z: z,
            z_angle: rot,
            color: [color1, color2]
        })
        veh.create(true);
        veh.setParamsEx(false, false, false, true, false, false, false);
        this._veh = veh;
        Vehicles.push(this);
    }

    spawn(): void{
        const MVehicle = getVehicleByUID(this._id);
        console.log(MVehicle, MVehicle?.veh);
        if(MVehicle?.veh) return;
        console.log("test")
        const veh = new Vehicle({
            modelId: this._model,
            x: this._vehPos.x,
            y: this._vehPos.y,
            z: this._vehPos.z,
            z_angle: this._vehPos.rot,
            color: [this._color1, this._color2]
        })
        this._veh = veh;
        this._veh.create();
    }

    unspawn(): void{
        const MVehicle = getVehicleByUID(this._id);
        if(!MVehicle || !MVehicle.veh) return;
        this._veh?.destroy();
        this._veh = undefined;
    }

    setSpawnData(x: number, y: number, z: number, rot: number, color1: number, color2: number): void{
        this._veh = new Vehicle({
            modelId: this._model,
            x: x,
            y: y,
            z: z,
            z_angle: rot,
            color: [color1, color2]
        })
    }

    set ownerType(value: number){
        this._ownerType = value;
    }

    get ownerType(): number{
        return this._ownerType;
    }

    set owner(value: number){
        this._owner = value;
    }

    get owner(): number{
        return this._owner;
    }

    set locked(value: boolean){
        this._locked = value;
    }

    get locked(): boolean{
        return this._locked;
    }

    set color1(value: number){
        this._color1 = value;
    }

    get color1(): number{
        return this._color1;
    }

    set color2(value: number){
        this._color2 = value;
    }

    get color2(): number{
        return this._color2;
    }

    get id(): number{
        return this._id;
    }

    get model(): number{
        return this._model;
    }

    set vehPos(value: Coordinates){
        this._vehPos = value;
    }

    get vehPos(): Coordinates{
        return this._vehPos;
    }
    
    get veh(): Vehicle | undefined{
        return this._veh;
    }
}