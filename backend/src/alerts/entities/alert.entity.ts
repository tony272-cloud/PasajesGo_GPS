import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { Organization } from '../../iam/entities/organization.entity';
import { Bus } from '../../fleet/entities/bus.entity';
import { Trip } from '../../fleet/entities/trip.entity';
import { AlertType } from '../enums/alert-type.enum';

@Entity('alerts')
export class Alert {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid', name: 'organization_id', nullable: true })
  organizationId: string;

  @ManyToOne(() => Organization, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'organization_id' })
  organization: Organization;

  @Column({ type: 'uuid', name: 'bus_id', nullable: true })
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
    type: 'enum',
    enum: AlertType,
  })
  type: AlertType;

  @Column({ type: 'text' })
  message: string;

  @Column({ type: 'timestamptz', default: () => 'CURRENT_TIMESTAMP' })
  ts: Date;

  @Column({
    type: 'geometry',
    spatialFeatureType: 'Point',
    srid: 4326,
    nullable: true,
  })
  geom: string;

  @Column({ type: 'timestamptz', nullable: true, name: 'resolved_at' })
  resolvedAt: Date;

  @CreateDateColumn({ type: 'timestamptz', name: 'created_at' })
  createdAt: Date;
}
