'use server';

import 'server-only';
import mysql from 'mysql2/promise';
import type { Motor, Plant, Relation, SimilarMotorData } from './types';
import { config } from 'dotenv';

config();

const pool = mysql.createPool({
    host: process.env.DB_HOST || '127.0.0.1',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'test',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

const formatData = (motor: Motor, relation: Relation | null, plant: Plant | null): SimilarMotorData => {
    let similar: string[] = [];
    if (relation && typeof relation.similar === 'string') {
        try {
            const parsed = JSON.parse(relation.similar);
            if (Array.isArray(parsed)) {
                similar = parsed.map(String);
            }
        } catch (e) {
            similar = relation.similar.split(',').map(s => s.trim()).filter(Boolean);
        }
    }
    
    return {
        plant_code: plant?.plant_code || (relation?.ubication === 'stock' ? 'Stock' : 'N/A'),
        motor_code: motor.motor_code,
        similar: similar,
        ubication: plant?.ubication || relation?.ubication || null,
        pallet: relation?.pallet || null,
        med_d: motor.med_d,
        power: motor.power,
        rpm: motor.rpm,
        power_hp: motor.power_hp,
        flange: motor.flange,
        equipment: plant?.equipment || null,
    };
};

const getFullMotorData = async (connection: mysql.PoolConnection, motor: Motor): Promise<SimilarMotorData> => {
    const [relationRows] = await connection.execute<Relation[]>('SELECT * FROM relations WHERE motor_id = ?', [motor.id]);
    const relation = relationRows.length > 0 ? relationRows[0] : null;

    let plant: Plant | null = null;
    if (relation && relation.plant_id) {
        const [plantRows] = await connection.execute<Plant[]>('SELECT * FROM plants WHERE id = ?', [relation.plant_id]);
        if (plantRows.length > 0) {
            plant = plantRows[0];
        }
    }
    return formatData(motor, relation, plant);
}


export const getMotorDataByCode = async (motorCode: string): Promise<SimilarMotorData | null> => {
    const connection = await pool.getConnection();
    try {
        const [motorRows] = await connection.execute<Motor[]>('SELECT * FROM motors WHERE motor_code = ?', [motorCode]);
        if (motorRows.length === 0) return null;
        const motor = motorRows[0];

        return await getFullMotorData(connection, motor);
    } catch (error) {
        console.error('Database query error in getMotorDataByCode:', error);
        return null;
    } finally {
        connection.release();
    }
}

export async function findSimilarMotors(motorCode: string): Promise<{ originalMotor: SimilarMotorData | null; similarMotors: SimilarMotorData[] }> {
    const connection = await pool.getConnection();
    try {
        const originalMotorData = await getMotorDataByCode(motorCode);

        if (!originalMotorData) {
            return { originalMotor: null, similarMotors: [] };
        }

        const codesToSearch = originalMotorData.similar;
        if (!codesToSearch || codesToSearch.length === 0) {
            return { originalMotor: originalMotorData, similarMotors: [] };
        }

        const placeholders = codesToSearch.map(() => 'JSON_CONTAINS(similar, ?)').join(' OR ');
        const query = `SELECT motor_id FROM relations WHERE ${placeholders}`;
        const queryParams = codesToSearch.map(code => `"${code}"`);

        const [relationRows] = await connection.execute<Relation[]>(query, queryParams);
        const motorIds = relationRows.map(r => r.motor_id);

        if (motorIds.length === 0) {
            return { originalMotor: originalMotorData, similarMotors: [] };
        }

        const motorPlaceholders = motorIds.map(() => '?').join(',');
        const [motorRows] = await connection.execute<Motor[]>(`SELECT * FROM motors WHERE id IN (${motorPlaceholders})`, motorIds);

        const similarMotorsPromises = motorRows.map(motor => getFullMotorData(connection, motor));
        const similarMotors = await Promise.all(similarMotorsPromises);

        return { originalMotor: originalMotorData, similarMotors };

    } catch (error) {
        console.error('Database query error in findSimilarMotors:', error);
        return { originalMotor: null, similarMotors: [] };
    } finally {
        connection.release();
    }
}

export async function findStandbyMotors(motorCode: string): Promise<SimilarMotorData[]> {
    const connection = await pool.getConnection();
    try {
        const [originalMotorRows] = await connection.execute<Motor[]>('SELECT * FROM motors WHERE motor_code = ?', [motorCode]);
        if (originalMotorRows.length === 0) {
            return [];
        }
        const originalMotor = originalMotorRows[0];

        let query: string;
        const params: (string | number | null)[] = [];

        if (originalMotor.flange === 'B3') {
            query = 'SELECT * FROM motors WHERE med_d = ? AND CAST(power AS DECIMAL(10,2)) >= ? AND motor_code != ?';
            params.push(originalMotor.med_d, Number(originalMotor.power) ?? 0, originalMotor.motor_code);
        } else {
            query = 'SELECT * FROM motors WHERE med_brida = ? AND med_d = ? AND CAST(power AS DECIMAL(10,2)) >= ? AND motor_code != ?';
            params.push(originalMotor.med_brida, originalMotor.med_d, Number(originalMotor.power) ?? 0, originalMotor.motor_code);
        }

        const [standbyMotorRows] = await connection.execute<Motor[]>(query, params);

        const standbyMotorsPromises = standbyMotorRows.map(motor => getFullMotorData(connection, motor));
        
        return Promise.all(standbyMotorsPromises);

    } catch (error) {
        console.error('Database query error in findStandbyMotors:', error);
        return [];
    } finally {
        connection.release();
    }
}
