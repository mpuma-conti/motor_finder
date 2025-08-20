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

const formatData = (motor: Motor, relation: Relation, plant: Plant | null): SimilarMotorData => {
    let similar: string[] = [];
    if (typeof relation.similar === 'string') {
        try {
            // Attempt to parse the string as JSON
            const parsed = JSON.parse(relation.similar);
            if (Array.isArray(parsed)) {
                similar = parsed.map(String);
            }
        } catch (e) {
            // Fallback for comma-separated strings or single values
            similar = relation.similar.split(',').map(s => s.trim()).filter(Boolean);
        }
    }
    
    return {
        plant_code: plant?.plant_code || (relation.ubication === 'stock' ? 'Stock' : 'N/A'),
        motor_code: motor.motor_code,
        similar: similar,
        ubication: plant?.ubication || relation.ubication,
        pallet: relation.pallet,
        med_d: motor.med_d,
        power: motor.power,
        rpm: motor.rpm,
        power_hp: motor.power_hp,
        flange: motor.flange,
    };
};

export const getMotorDataByCode = async (motorCode: string): Promise<SimilarMotorData | null> => {
    const connection = await pool.getConnection();
    try {
        const [motorRows] = await connection.execute<Motor[]>('SELECT * FROM motors WHERE motor_code = ?', [motorCode]);
        if (motorRows.length === 0) return null;
        const motor = motorRows[0];

        const [relationRows] = await connection.execute<Relation[]>('SELECT * FROM relations WHERE motor_id = ?', [motor.id]);
        if (relationRows.length === 0) {
             // Return motor data even if there's no relation, with empty similar array
             return formatData(motor, { similar: [], id: 0, motor_id: motor.id, plant_id: null, ubication: null, pallet: null, status: null }, null);
        }
        const relation = relationRows[0];

        let plant: Plant | null = null;
        if (relation.plant_id) {
            const [plantRows] = await connection.execute<Plant[]>('SELECT * FROM plants WHERE id = ?', [relation.plant_id]);
            if (plantRows.length > 0) {
                plant = plantRows[0];
            }
        }
        
        return formatData(motor, relation, plant);
    } catch (error) {
        console.error('Database query error:', error);
        return null;
    } finally {
        connection.release();
    }
}

export async function findSimilarMotors(motorCode: string): Promise<{ originalMotor: SimilarMotorData | null; similarMotors: SimilarMotorData[] }> {
    const originalMotorData = await getMotorDataByCode(motorCode);

    if (!originalMotorData) {
        return { originalMotor: null, similarMotors: [] };
    }

    const similarMotorCodes = originalMotorData.similar;

    if (!similarMotorCodes || similarMotorCodes.length === 0) {
        return { originalMotor: originalMotorData, similarMotors: [] };
    }

    const similarMotorsPromises = similarMotorCodes.map(code => getMotorDataByCode(code));
    const similarMotors = (await Promise.all(similarMotorsPromises)).filter((motor): motor is SimilarMotorData => motor !== null);

    return { originalMotor: originalMotorData, similarMotors };
}
