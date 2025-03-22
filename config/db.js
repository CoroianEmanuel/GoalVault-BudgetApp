import pg from 'pg';
import dotenv from 'dotenv';
import { Sequelize } from 'sequelize';

const {Pool} = pg;

dotenv.config({path: './.env'});

const pool = new Pool({
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    database: process.env.DB_NAME,
    password: process.env.DB_PASSWORD,
    port: process.env.DB_PORT,
});

export async function connectDB() {
    try {
        await pool.connect();
        console.log('Connection to Database successful');
    } catch (err) {
        console.log('Error at connection to Database:', err);
    }
}

const sequelize = new Sequelize(process.env.DATABASE_URL, {
    dialect: "postgres",
    logging: false,
});

export {pool, sequelize};
