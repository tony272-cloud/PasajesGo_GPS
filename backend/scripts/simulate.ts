// @ts-ignore
import { Pool } from 'pg';
import * as crypto from 'crypto';
// @ts-ignore
import * as dotenv from 'dotenv';


dotenv.config();

const dbUrl = process.env.DATABASE_URL || 'postgres://postgres:postgres123@localhost:5433/pasajesgo_db';

const pool = new Pool({
  connectionString: dbUrl,
});

async function runSimulation() {
  console.log('Connecting to database...');
  const client = await pool.connect();

  try {
    // 1. Create or get Organization
    let orgRes = await client.query(`SELECT id FROM organizations WHERE ruc_or_tax_id = $1`, ['SIM-RUC-123']);
    let orgId;
    if (orgRes.rows.length === 0) {
      orgRes = await client.query(
        `INSERT INTO organizations (name, ruc_or_tax_id, contact_email) VALUES ($1, $2, $3) RETURNING id`,
        ['Simulated Bus Company', 'SIM-RUC-123', 'admin@simbus.com']
      );
    }
    orgId = orgRes.rows[0].id;

    // 2. Create or get Bus
    const deviceToken = 'simulated-token-456';
    const hash = crypto.createHash('sha256').update(deviceToken).digest('hex');

    let busRes = await client.query(`SELECT id FROM buses WHERE plate = $1`, ['SIM-001']);
    let busId;
    if (busRes.rows.length === 0) {
      busRes = await client.query(
        `INSERT INTO buses (organization_id, plate, model, capacity, device_token_hash) VALUES ($1, $2, $3, $4, $5) RETURNING id`,
        [orgId, 'SIM-001', 'Volvo Bus', 40, hash]
      );
    } else {
      await client.query(`UPDATE buses SET device_token_hash = $1 WHERE id = $2`, [hash, busRes.rows[0].id]);
    }
    busId = busRes.rows[0].id;

    console.log(`\nSimulation configuration complete.`);
    console.log(`Organization ID: ${orgId}`);
    console.log(`Bus ID: ${busId}`);
    console.log(`Device Token: ${deviceToken} (hashed in DB)`);
    console.log(`Starting real-time simulation...\n`);

    client.release();

    // 3. Simulate Movement in a loop
    let lat = -13.531950; // Cusco centro
    let lng = -71.967463;

    setInterval(async () => {
      // Move slightly
      lat += (Math.random() - 0.5) * 0.0005;
      lng += (Math.random() - 0.5) * 0.0005;

      const payload = {
        busId,
        positions: [
          {
            ts: new Date().toISOString(),
            lat,
            lng,
            speedKmh: Math.floor(Math.random() * 40) + 10,
            headingDeg: Math.floor(Math.random() * 360),
            accuracyM: 5
          }
        ]
      };

      try {
        const res = await fetch('http://localhost:3000/api/v1/telemetry', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'x-device-token': deviceToken
          },
          body: JSON.stringify(payload)
        });

        if (!res.ok) {
          console.error(`Error sending telemetry: ${res.status} ${res.statusText}`);
          const text = await res.text();
          console.error(text);
        } else {
          console.log(`[${new Date().toISOString()}] Sent position: ${lat.toFixed(5)}, ${lng.toFixed(5)}`);
        }
      } catch (err: any) {
        console.error('Failed to send telemetry. Is the backend running? Error details:', err.message);
      }
    }, 3000);

  } catch (err) {
    console.error('Simulation error:', err);
    client.release();
  }
}

runSimulation();
