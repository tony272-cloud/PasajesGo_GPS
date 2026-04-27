const { Client } = require('pg');
const crypto = require('crypto');

// Simulated Route (Avenue in Lima - Paseo de la Republica approx)
const routeCoordinates = [
  [-77.03450, -12.06214],
  [-77.03362, -12.06450],
  [-77.03260, -12.06730],
  [-77.03158, -12.07000],
  [-77.03050, -12.07300],
  [-77.02980, -12.07600],
  [-77.02890, -12.07850],
  [-77.02800, -12.08150],
  [-77.02710, -12.08450],
  [-77.02630, -12.08750],
  [-77.02550, -12.09050],
  [-77.02470, -12.09350],
  [-77.02390, -12.09650],
  [-77.02310, -12.09950],
  [-77.02230, -12.10250],
  [-77.02150, -12.10550],
  [-77.02070, -12.10850],
  [-77.01990, -12.11150]
];

const RAW_TOKEN = 'simulator-super-secret-token-123';
const TOKEN_HASH = crypto.createHash('sha256').update(RAW_TOKEN).digest('hex');

async function setupDatabase() {
  const client = new Client({
    user: 'postgres',
    host: 'localhost',
    database: 'pasajesgo_db',
    password: 'postgres123',
    port: 5433,
  });

  await client.connect();
  console.log('✅ Connected to PostgreSQL');

  // Insert Orgnization
  let orgRes = await client.query(`SELECT id FROM organizations WHERE name = 'Translima S.A.'`);
  let orgId;
  if (orgRes.rows.length === 0) {
    const res = await client.query(`
      INSERT INTO organizations (name, ruc_or_tax_id) 
      VALUES ('Translima S.A.', '20123456789') RETURNING id
    `);
    orgId = res.rows[0].id;
    console.log('🏢 Created Organization: Translima S.A.');
  } else {
    orgId = orgRes.rows[0].id;
    console.log('🏢 Found Organization: Translima S.A.');
  }

  // Insert Bus
  let busRes = await client.query(`SELECT id FROM buses WHERE plate = 'SIM-001'`);
  let busId;
  if (busRes.rows.length === 0) {
    const res = await client.query(`
      INSERT INTO buses (organization_id, plate, device_token_hash, capacity, model, status)
      VALUES ($1, 'SIM-001', $2, 45, 'Volvo Bus', 'ACTIVE') RETURNING id
    `, [orgId, TOKEN_HASH]);
    busId = res.rows[0].id;
    console.log('🚌 Created Bus: SIM-001');
  } else {
    busId = busRes.rows[0].id;
    // Update hash just in case
    await client.query(`UPDATE buses SET device_token_hash = $1 WHERE id = $2`, [TOKEN_HASH, busId]);
    console.log('🚌 Found Bus: SIM-001 (Token updated)');
  }

  await client.end();
  return { orgId, busId };
}

async function startSimulation(busId) {
  console.log('\\n🚀 Iniciando simulación de transmisión GPS cada 3 segundos...');
  let currentIndex = 0;
  let direction = 1;

  setInterval(async () => {
    const coord = routeCoordinates[currentIndex];
    
    // Slight randomness to simulate GPS drift and speed variations
    const driftLng = (Math.random() - 0.5) * 0.0001;
    const driftLat = (Math.random() - 0.5) * 0.0001;
    
    // Simulate speed: ~40km/h naturally, 10% chance to overspeed (>90km/h) to check alerts
    let speed = 40 + Math.random() * 20;
    if (Math.random() > 0.9) {
      speed = 95 + Math.random() * 10; // Overspeed!
      console.log('⚠️ Simulating Overspeed!');
    }

    const payload = {
      busId: busId,
      positions: [
        {
          ts: new Date().toISOString(),
          lng: coord[0] + driftLng,
          lat: coord[1] + driftLat,
          speedKmh: speed,
          headingDeg: 180 + (Math.random() * 10), // Pointing south roughly
          accuracyM: 5
        }
      ]
    };

    try {
      const resp = await fetch('http://127.0.0.1:3000/api/v1/telemetry', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-device-token': RAW_TOKEN
        },
        body: JSON.stringify(payload)
      });

      if (resp.ok) {
        console.log(`📡 [${new Date().toLocaleTimeString()}] Sent position: ${coord[1]}, ${coord[0]} | Speed: ${speed.toFixed(1)} km/h`);
      } else {
        const err = await resp.text();
        console.error('❌ Failed to send telemetry:', err);
      }
    } catch (e) {
      console.error('❌ Network error contacting telemetry API:', e.message);
    }

    // Move to next point
    currentIndex += direction;
    if (currentIndex >= routeCoordinates.length - 1) {
      direction = -1; // Turn around
    } else if (currentIndex <= 0) {
      direction = 1;
    }

  }, 3000); // Every 3 seconds
}

async function run() {
  try {
    const { busId } = await setupDatabase();
    await startSimulation(busId);
  } catch (e) {
    console.error('Fatal Error:', e);
  }
}

run();
