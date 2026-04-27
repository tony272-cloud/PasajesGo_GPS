import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { Organization } from '../../iam/entities/organization.entity';
import { BusStatus } from '../enums/bus-status.enum';

@Entity('buses')
export class Bus {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid', name: 'organization_id', nullable: true })
  organizationId: string;

  @ManyToOne(() => Organization, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'organization_id' })
  organization: Organization;

  @Column({ length: 20, unique: true })
  plate: string;

  @Column({ length: 100, nullable: true })
  model: string;

  @Column({ type: 'int', nullable: true })
  capacity: number;

  @Column({ length: 255, unique: true, name: 'device_token_hash' })
  deviceTokenHash: string;

  @Column({
    type: 'enum',
    enum: BusStatus,
    default: BusStatus.ACTIVE,
  })
  status: BusStatus;

  @CreateDateColumn({ type: 'timestamptz', name: 'created_at' })
  createdAt: Date;
}
