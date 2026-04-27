// @ts-ignore
import { Pool } from 'pg';
// @ts-ignore
import * as bcrypt from 'bcrypt';
// @ts-ignore
import * as dotenv from 'dotenv';
dotenv.config();

const dbUrl = process.env.DATABASE_URL || 'postgres://postgres:postgres123@localhost:5433/pasajesgo_db';
const pool = new Pool({ connectionString: dbUrl });

async function createAdmin() {
  const client = await pool.connect();
  try {
    const email = 'admin@simbus.com';
    const password = 'password123';
    const passwordHash = await bcrypt.hash(password, 10);
    
    // Check if user exists
    let res = await client.query('SELECT * FROM users WHERE email = $1', [email]);
    if (res.rows.length === 0) {
      await client.query(
        'INSERT INTO users (email, password_hash, role) VALUES ($1, $2, $3)',
        [email, passwordHash, 'SUPERADMIN']
      );
      console.log(`\n✅ Administrator User Created!`);
      console.log(`Email: ${email}`);
      console.log(`Password: ${password}\n`);
    } else {
      console.log(`\nℹ️ Administrator User already exists.`);
      console.log(`Email: ${email}`);
      console.log(`Password: ${password}\n`);
    }
  } catch (e) {
    console.error(e);
  } finally {
    client.release();
    pool.end();
  }
}

createAdmin();
