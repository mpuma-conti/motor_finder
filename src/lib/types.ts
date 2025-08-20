import { RowDataPacket } from 'mysql2';

export interface Motor extends RowDataPacket {
    id: number;
    motor_code: string;
    brand: string | null;
    model: string | null;
    conexion: string | null;
    power_hp: number | null;
    flange: string | null;
    power: number | null;
    current: number | null;
    rpm: number | null;
    cos_fi: number | null;
    obs: string | null;
    med_s: number | null;
    med_brida: number | null;
    med_m: number | null;
    med_agujeros: number | null;
    n_agujeros: number | null;
    med_a: number | null;
    med_b: number | null;
    med_l: number | null;
    med_d: number | null;
    med_e: number | null;
    med_h: number | null;
    rod_delant: string | null;
    rod_post: string | null;
    rod_marca: string | null;
    reten_delant: string | null;
    reten_post: string | null;
    reten_marca: string | null;
    vent_tipo: string | null;
    vent_diam: number | null;
    vent_eje: number | null;
    chaveta: string | null;
}

export interface Plant extends RowDataPacket {
    id: number;
    plant_code: string;
    line: string | null;
    section: string | null;
    equipment: string | null;
    ubication: string | null;
}

export interface Relation extends RowDataPacket {
    id: number;
    motor_id: number;
    plant_id: number | null;
    similar: string | string[]; // Can be string from DB
    ubication: string | null;
    pallet: string | null;
    status: string | null;
}

export type SimilarMotorData = {
    plant_code: string | null;
    motor_code: string;
    similar: string[];
    ubication: string | null;
    pallet: string | null;
    med_d: number | null;
    power: number | null;
    rpm: number | null;
    power_hp: number | null;
    flange: string | null;
    equipment: string | null;
};
