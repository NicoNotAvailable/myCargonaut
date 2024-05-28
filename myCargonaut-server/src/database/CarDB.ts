import {Column, ChildEntity} from 'typeorm';
import {VehicleDB} from "./VehicleDB";

@ChildEntity()
export class CarDB extends VehicleDB {

    @Column()
    hasAC: boolean;

    @Column()
    hasTelevision: boolean;
}
