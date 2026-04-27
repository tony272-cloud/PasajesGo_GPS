import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { Route } from './route.entity';

@Entity('stops')
export class Stop {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid', name: 'route_id', nullable: true })
  routeId: string;

  @ManyToOne(() => Route, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'route_id' })
  route: Route;

  @Column({ length: 150 })
  name: string;

  @Column({ type: 'int', name: 'sequence_order' })
  sequenceOrder: number;

  @Column({
    type: 'geometry',
    spatialFeatureType: 'Point',
    srid: 4326,
  })
  geom: string; // Typically parsed as WKT or GeoJSON depending on ORM config

  @Column({ type: 'numeric', default: 30.0, name: 'radius_meters' })
  radiusMeters: number;

  @CreateDateColumn({ type: 'timestamptz', name: 'created_at' })
  createdAt: Date;
}
