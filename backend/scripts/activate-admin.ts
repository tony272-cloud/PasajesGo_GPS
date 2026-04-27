// @ts-ignore
import { Pool } from 'pg';
// @ts-ignore
import * as dotenv from 'dotenv';
dotenv.config();

const dbUrl = process.env.DATABASE_URL || 'postgres://postgres:postgres123@localhost:5433/pasajesgo_db';
const pool = new Pool({ connectionString: dbUrl });

async function activateUser() {
  const client = await pool.connect();
  try {
    const res = await client.query("UPDATE users SET is_active = true WHERE email = 'admin@simbus.com' RETURNING is_active");
    console.log('User activated:', res.rows[0]);
  } catch (e) {
    console.error(e);
  } finally {
    client.release();
    pool.end();
  }
}

activateUser();
