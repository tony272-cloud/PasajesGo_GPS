import { Entity, PrimaryColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { Bus } from '../../fleet/entities/bus.entity';
import { Trip } from '../../fleet/entities/trip.entity';

@Entity('bus_positions')
export class BusPosition {
  @PrimaryColumn({ type: 'bigint' })
  id: string;

  // The composite primary key includes 'ts' because of table partitioning in PostgreSQL
  @PrimaryColumn({ type: 'timestamptz' })
  ts: Date;

  @Column({ type: 'uuid', name: 'bus_id' })
  busId: string;

  @ManyToOne(() => Bus)
  @JoinColumn({ name: 'bus_id' })
  bus: Bus;

  @Column({ type: 'uuid', name: 'trip_id', nullable: true })
  tripId: string;

  @ManyToOne(() => Trip)
  @JoinColumn({ name: 'trip_id' })
  trip: Trip;

  @Column({
    type: 'geometry',
    spatialFeatureType: 'Point',
    srid: 4326,
  })
  geom: string; // Stored as GeoJSON or WKT

  @Column({ type: 'numeric', nullable: true, name: 'speed_kmh' })
  speedKmh: number;

  @Column({ type: 'numeric', nullable: true, name: 'heading_deg' })
  headingDeg: number;

  @Column({ type: 'numeric', nullable: true, name: 'accuracy_m' })
  accuracyM: number;
}
