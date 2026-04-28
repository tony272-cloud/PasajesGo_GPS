-- 1. Enable PostGIS Extension and UUIDs
CREATE EXTENSION IF NOT EXISTS postgis;
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. ENUM Types
CREATE TYPE user_role AS ENUM ('SUPERADMIN', 'ORG_ADMIN', 'OPERATOR', 'DRIVER', 'PASSENGER');
CREATE TYPE bus_status AS ENUM ('ACTIVE', 'MAINTENANCE', 'OUT_OF_SERVICE');
CREATE TYPE trip_status AS ENUM ('SCHEDULED', 'IN_PROGRESS', 'COMPLETED', 'CANCELED');
CREATE TYPE alert_type AS ENUM ('SPEEDING', 'ROUTE_DEVIATION', 'STOP_DELAY', 'GEOFENCE_ENTER', 'GEOFENCE_EXIT', 'SOS');

-- 3. Tables

CREATE TABLE organizations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    ruc_or_tax_id VARCHAR(50) UNIQUE NOT NULL,
    contact_email VARCHAR(255),
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    organization_id UUID REFERENCES organizations(id) ON DELETE SET NULL, -- Nullable for SUPERADMIN without specific org
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    role user_role NOT NULL DEFAULT 'PASSENGER',
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE buses (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    organization_id UUID REFERENCES organizations(id) ON DELETE CASCADE,
    plate VARCHAR(20) UNIQUE NOT NULL,
    model VARCHAR(100),
    capacity INTEGER,
    device_token_hash VARCHAR(255) UNIQUE NOT NULL,
    status bus_status DEFAULT 'ACTIVE',
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE routes (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    organization_id UUID REFERENCES organizations(id) ON DELETE CASCADE,
    name VARCHAR(150) NOT NULL,
    color_hex VARCHAR(7) DEFAULT '#000000',
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE stops (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    route_id UUID REFERENCES routes(id) ON DELETE CASCADE,
    name VARCHAR(150) NOT NULL,
    sequence_order INTEGER NOT NULL,
    geom GEOMETRY(Point, 4326) NOT NULL,
    radius_meters NUMERIC DEFAULT 30.0,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    UNIQUE (route_id, sequence_order)
);

CREATE TABLE route_paths (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    route_id UUID REFERENCES routes(id) ON DELETE CASCADE,
    path GEOMETRY(LineString, 4326) NOT NULL,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE trips (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    bus_id UUID REFERENCES buses(id),
    route_id UUID REFERENCES routes(id),
    driver_id UUID REFERENCES users(id),
    started_at TIMESTAMPTZ,
    ended_at TIMESTAMPTZ,
    status trip_status DEFAULT 'SCHEDULED',
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- Bus Positions (Partitioned Table)
CREATE TABLE bus_positions (
    id BIGSERIAL,
    bus_id UUID NOT NULL REFERENCES buses(id),
    trip_id UUID REFERENCES trips(id),
    ts TIMESTAMPTZ NOT NULL,
    geom GEOMETRY(Point, 4326) NOT NULL,
    speed_kmh NUMERIC,
    heading_deg NUMERIC,
    accuracy_m NUMERIC,
    PRIMARY KEY (id, ts)
) PARTITION BY RANGE (ts);

-- Example Partitions for 2026
CREATE TABLE IF NOT EXISTS bus_positions_y2026m03 PARTITION OF bus_positions FOR VALUES FROM ('2026-03-01') TO ('2026-04-01');
CREATE TABLE IF NOT EXISTS bus_positions_y2026m04 PARTITION OF bus_positions FOR VALUES FROM ('2026-04-01') TO ('2026-05-01');
CREATE TABLE IF NOT EXISTS bus_positions_y2026m05 PARTITION OF bus_positions FOR VALUES FROM ('2026-05-01') TO ('2026-06-01');
CREATE TABLE IF NOT EXISTS bus_positions_y2026m06 PARTITION OF bus_positions FOR VALUES FROM ('2026-06-01') TO ('2026-07-01');
CREATE TABLE IF NOT EXISTS bus_positions_y2026m07 PARTITION OF bus_positions FOR VALUES FROM ('2026-07-01') TO ('2026-08-01');
CREATE TABLE IF NOT EXISTS bus_positions_y2026m08 PARTITION OF bus_positions FOR VALUES FROM ('2026-08-01') TO ('2026-09-01');
CREATE TABLE IF NOT EXISTS bus_positions_y2026m09 PARTITION OF bus_positions FOR VALUES FROM ('2026-09-01') TO ('2026-10-01');
CREATE TABLE IF NOT EXISTS bus_positions_y2026m10 PARTITION OF bus_positions FOR VALUES FROM ('2026-10-01') TO ('2026-11-01');
CREATE TABLE IF NOT EXISTS bus_positions_y2026m11 PARTITION OF bus_positions FOR VALUES FROM ('2026-11-01') TO ('2026-12-01');
CREATE TABLE IF NOT EXISTS bus_positions_y2026m12 PARTITION OF bus_positions FOR VALUES FROM ('2026-12-01') TO ('2027-01-01');

CREATE TABLE geofences (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    organization_id UUID REFERENCES organizations(id) ON DELETE CASCADE,
    name VARCHAR(150) NOT NULL,
    geom GEOMETRY(Polygon, 4326) NOT NULL,
    alert_type alert_type NOT NULL,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE alerts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    organization_id UUID REFERENCES organizations(id) ON DELETE CASCADE,
    bus_id UUID REFERENCES buses(id),
    trip_id UUID REFERENCES trips(id),
    type alert_type NOT NULL,
    message TEXT NOT NULL,
    ts TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    geom GEOMETRY(Point, 4326),
    resolved_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE refresh_tokens (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    token_hash VARCHAR(255) UNIQUE NOT NULL,
    expires_at TIMESTAMPTZ NOT NULL,
    revoked BOOLEAN DEFAULT false,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE audit_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE SET NULL,
    action VARCHAR(100) NOT NULL,
    entity_type VARCHAR(100) NOT NULL,
    entity_id UUID,
    ip_address VARCHAR(45),
    metadata JSONB,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- 4. Indexes (Performance tuning)

-- GiST Indexes for Spatial Data
CREATE INDEX idx_stops_geom ON stops USING GIST (geom);
CREATE INDEX idx_route_paths_path ON route_paths USING GIST (path);
CREATE INDEX idx_bus_positions_geom ON bus_positions USING GIST (geom);
CREATE INDEX idx_geofences_geom ON geofences USING GIST (geom);
CREATE INDEX idx_alerts_geom ON alerts USING GIST (geom);

-- B-Tree Indexes for Foreign Keys and Commonly Filtered Columns
CREATE INDEX idx_users_org_id ON users(organization_id);
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_buses_org_id ON buses(organization_id);
CREATE INDEX idx_buses_status ON buses(status);
CREATE INDEX idx_trips_bus_id_status ON trips(bus_id, status);
CREATE INDEX idx_bus_positions_bus_id_ts ON bus_positions(bus_id, ts DESC);
CREATE INDEX idx_alerts_bus_id_ts ON alerts(bus_id, ts DESC);
CREATE INDEX idx_alerts_resolved_at ON alerts(resolved_at);
CREATE INDEX idx_audit_logs_user_id ON audit_logs(user_id);

-- 5. Triggers for updated_at

CREATE OR REPLACE FUNCTION update_modified_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_users_modtime
    BEFORE UPDATE ON users
    FOR EACH ROW
    EXECUTE FUNCTION update_modified_column();
