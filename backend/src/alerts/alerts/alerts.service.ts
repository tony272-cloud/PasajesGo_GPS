import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { Alert } from '../entities/alert.entity';
import { CreateAlertDto } from './dto/alert.dto';
import { UserRole } from '../../iam/enums/user-role.enum';
import { Bus } from '../../fleet/entities/bus.entity';

@Injectable()
export class AlertsService {
  constructor(
    @InjectRepository(Alert)
    private readonly alertRepository: Repository<Alert>,
    private readonly dataSource: DataSource,
  ) {}

  async create(createDto: CreateAlertDto) {
    // Usually created internally by the geofence engine or telemetry service
    // But we expose it for potentially manual or external triggers
    
    // Instead of using TypeORM save which might have issues with raw PostGIS strings if not configured directly,
    // we use query builder.
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    
    try {
        const result = await queryRunner.manager.query(`
          INSERT INTO alerts (organization_id, bus_id, trip_id, type, message, geom)
          VALUES ($1, $2, $3, $4, $5, ${createDto.geomWkt ? `ST_GeomFromText('${createDto.geomWkt}', 4326)` : 'NULL'})
          RETURNING *;
        `, [
          createDto.organizationId || null, 
          createDto.busId, 
          createDto.tripId || null, 
          createDto.type, 
          createDto.message
        ]);
        
        return result[0];
    } finally {
        await queryRunner.release();
    }
  }

  async findAll(currentUser: any, query: any) {
    const take = query.limit ? parseInt(query.limit) : 20;
    const skip = query.page ? (parseInt(query.page) - 1) * take : 0;
    
    const qb = this.alertRepository.createQueryBuilder('alert')
      .leftJoinAndSelect('alert.bus', 'bus')
      .take(take)
      .skip(skip)
      .orderBy('alert.ts', 'DESC');

    if (currentUser.role !== UserRole.SUPERADMIN) {
      qb.andWhere('alert.organizationId = :orgId', { orgId: currentUser.organizationId });
    }

    if (query.type) qb.andWhere('alert.type = :type', { type: query.type });
    if (query.busId) qb.andWhere('alert.busId = :busId', { busId: query.busId });
    
    if (query.status === 'RESOLVED') {
      qb.andWhere('alert.resolvedAt IS NOT NULL');
    } else if (query.status === 'OPEN') {
      qb.andWhere('alert.resolvedAt IS NULL');
    }

    const [data, total] = await qb.getManyAndCount();

    return {
      data,
      total,
      page: query.page || 1,
      limit: take,
    };
  }

  async markAsResolved(id: string, currentUser: any) {
    const alert = await this.alertRepository.findOne({ where: { id }});
    if (!alert) throw new NotFoundException('Alerta no encontrada');

    if (currentUser.role !== UserRole.SUPERADMIN && alert.organizationId !== currentUser.organizationId) {
      throw new ForbiddenException('No tienes permisos sobre esta alerta');
    }

    alert.resolvedAt = new Date();
    return this.alertRepository.save(alert);
  }
}
