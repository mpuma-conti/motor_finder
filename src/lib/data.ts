import type { Motor, Plant, Relation, SimilarMotorData } from './types';

const motors: Motor[] = [
    { id: 1, motor_code: 'M-B3-4-H', brand: null, model: null, conexion: null, power_hp: 4, flange: 'B3', power: 7.3, current: null, rpm: 3500, cos_fi: null, obs: null, med_s: null, med_brida: null, med_m: null, med_agujeros: null, n_agujeros: null, med_a: 190, med_b: 139, med_l: null, med_d: 28, med_e: 65, med_h: null, rod_delant: '6306 2RS1C3', rod_post: '6206 2RS1C3', rod_marca: null, reten_delant: '30*42*7', reten_post: '30*42*7', reten_marca: null, vent_tipo: 'plastico', vent_diam: 180, vent_eje: 30, chaveta: '8*8*45' },
    { id: 2, motor_code: 'M-B3-4-G', brand: null, model: null, conexion: null, power_hp: 4, flange: 'B3', power: 7.3, current: null, rpm: 3500, cos_fi: null, obs: null, med_s: null, med_brida: null, med_m: null, med_agujeros: null, n_agujeros: null, med_a: 195, med_b: 140, med_l: 420, med_d: 28, med_e: 63, med_h: 115, rod_delant: '6306 2RS1C3', rod_post: '6202 2RS1C3', rod_marca: null, reten_delant: '30*42*7', reten_post: '30*42*7', reten_marca: null, vent_tipo: 'Aluminio', vent_diam: 150, vent_eje: 30, chaveta: '7*8*50' },
    { id: 3, motor_code: 'MC202', brand: 'WEG', model: 'W22', conexion: 'Estrella', power_hp: 5.5, flange: 'B5', power: 4, current: 8.5, rpm: 1450, cos_fi: 0.85, obs: 'Motor de repuesto', med_s: null, med_brida: 250, med_m: 215, med_agujeros: 180, n_agujeros: 4, med_a: 200, med_b: 160, med_l: 450, med_d: 38, med_e: 80, med_h: 140, rod_delant: '6308 ZZ', rod_post: '6208 ZZ', rod_marca: 'SKF', reten_delant: '40*80*10', reten_post: '40*80*10', reten_marca: 'SAV', vent_tipo: 'plastico', vent_diam: 200, vent_eje: 38, chaveta: '10*8*70' },
    { id: 4, motor_code: 'MC200', brand: 'Siemens', model: '1LE1', conexion: 'Triangulo', power_hp: 5.5, flange: 'B5', power: 4, current: 8.2, rpm: 1450, cos_fi: 0.86, obs: null, med_s: null, med_brida: 250, med_m: 215, med_agujeros: 180, n_agujeros: 4, med_a: 200, med_b: 160, med_l: 455, med_d: 38, med_e: 80, med_h: 140, rod_delant: '6308 ZZ', rod_post: '6208 ZZ', rod_marca: 'FAG', reten_delant: '40*80*10', reten_post: '40*80*10', reten_marca: 'CR', vent_tipo: 'Aluminio', vent_diam: 200, vent_eje: 38, chaveta: '10*8*70' },
    { id: 5, motor_code: 'MC211', brand: 'ABB', model: 'M2BAX', conexion: 'Estrella', power_hp: 10, flange: 'B3', power: 7.5, current: 15, rpm: 1470, cos_fi: 0.83, obs: null, med_s: null, med_brida: null, med_m: null, med_agujeros: null, n_agujeros: null, med_a: 250, med_b: 200, med_l: 500, med_d: 42, med_e: 90, med_h: 160, rod_delant: '6309 ZZ', rod_post: '6209 ZZ', rod_marca: 'NSK', reten_delant: '50*90*10', reten_post: '50*90*10', reten_marca: 'TTO', vent_tipo: 'plastico', vent_diam: 220, vent_eje: 42, chaveta: '12*8*80' },
];

const plants: Plant[] = [
    { id: 3, plant_code: 'MC200-PLANT', line: 'ABG1', section: 'Carga y Alimentación', equipment: 'Faja transportadora de ulexita', ubication: 'Sótano Línea ABG I' },
    { id: 4, plant_code: 'P200', line: 'ABG1', section: 'Carga, Reacción y Filtración', equipment: 'Bomba de solución - succión MS201', ubication: 'Cota 0.0 por intercambiadores de calor' },
    { id: 6, plant_code: 'MC211-PLANT', line: 'ABG2', section: 'Molienda', equipment: 'Molino de bolas', ubication: 'Nivel +3.0' },
];

const relations: Relation[] = [
    { id: 1, motor_id: 1, plant_id: 3, similar: ['M-B3-4-G'], ubication: 'operativo', pallet: null, status: 'ok' },
    { id: 2, motor_id: 2, plant_id: 4, similar: ['M-B3-4-H'], ubication: 'stock', pallet: 'A1', status: 'stock' },
    { id: 3, motor_id: 3, plant_id: null, similar: ['MC200'], ubication: 'stock', pallet: 'I3', status: 'revisar' },
    { id: 4, motor_id: 5, plant_id: 6, similar: [], ubication: 'operativo', pallet: null, status: 'revisar' },
    { id: 5, motor_id: 4, plant_id: 3, similar: ['MC202'], ubication: 'operativo', pallet: null, status: 'ok' },
];

const formatData = (motor: Motor, relation: Relation, plant: Plant | null): SimilarMotorData => ({
    plant_code: plant?.plant_code || (relation.ubication === 'stock' ? 'Stock' : 'N/A'),
    motor_code: motor.motor_code,
    similar: relation.similar,
    ubication: plant?.ubication || relation.ubication,
    pallet: relation.pallet,
    med_d: motor.med_d,
    power: motor.power,
    rpm: motor.rpm,
    power_hp: motor.power_hp,
    flange: motor.flange,
});

export const getMotorDataByCode = (motorCode: string) => {
    const motor = motors.find(m => m.motor_code === motorCode);
    if (!motor) return null;

    const relation = relations.find(r => r.motor_id === motor.id);
    if (!relation) return null;

    const plant = relation.plant_id ? plants.find(p => p.id === relation.plant_id) : null;
    return formatData(motor, relation, plant);
}

export async function findSimilarMotors(motorCode: string): Promise<{ originalMotor: SimilarMotorData | null; similarMotors: SimilarMotorData[] }> {
    const originalMotorData = getMotorDataByCode(motorCode);

    if (!originalMotorData) {
        return { originalMotor: null, similarMotors: [] };
    }

    const similarMotorCodes = originalMotorData.similar;

    const similarMotors = similarMotorCodes
        .map(code => getMotorDataByCode(code))
        .filter((motor): motor is SimilarMotorData => motor !== null);

    return { originalMotor: originalMotorData, similarMotors };
}

export const getStockInfo = () => {
    const stockMotors = relations.filter(r => r.status === 'stock').map(r => motors.find(m => m.id === r.motor_id)?.motor_code);
    return `Available in stock: ${stockMotors.filter(Boolean).join(', ') || 'None'}`;
}
