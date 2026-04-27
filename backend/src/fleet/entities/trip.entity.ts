import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { Bus } from './bus.entity';
import { Route } from './route.entity';
import { User } from '../../iam/entities/user.entity';
import { TripStatus } from '../enums/trip-status.enum';

@Entity('trips')
export class Trip {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid', name: 'bus_id', nullable: true })
  busId: string;

  @ManyToOne(() => Bus)
  @JoinColumn({ name: 'bus_id' })
  bus: Bus;

  @Column({ type: 'uuid', name: 'route_id', nullable: true })
  routeId: string;

  @ManyToOne(() => Route)
  @JoinColumn({ name: 'route_id' })
  route: Route;

  @Column({ type: 'uuid', name: 'driver_id', nullable: true })
  driverId: string;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'driver_id' })
  driver: User;

  @Column({ type: 'timestamptz', nullable: true, name: 'started_at' })
  startedAt: Date;

  @Column({ type: 'timestamptz', nullable: true, name: 'ended_at' })
  endedAt: Date;

  @Column({
    type: 'enum',
    enum: TripStatus,
    default: TripStatus.SCHEDULED,
  })
  status: TripStatus;

  @CreateDateColumn({ type: 'timestamptz', name: 'created_at' })
  createdAt: Date;
}
