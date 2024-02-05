import mysql, { PoolOptions } from 'mysql2';
import * as dotenv from "dotenv";
import path from 'path';

dotenv.config({ path: path.join(__dirname, "..\\.env") });

const access: PoolOptions = {
    connectionLimit: 10,
    host: process.env.MYSQL_HOST,
    user: process.env.MYSQL_USER,
    password: process.env.MYSQL_PASS,
    database: process.env.MYSQL_DB,
};

const connection = mysql.createPool(access);

export default connection;
