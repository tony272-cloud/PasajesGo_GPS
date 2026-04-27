import { Injectable, NotFoundException, BadRequestException, ForbiddenException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource } from 'typeorm';
import { Route } from '../entities/route.entity';
import { Stop } from '../entities/stop.entity';
import { RoutePath } from '../entities/route-path.entity';
import { CreateRouteDto, ReorderStopsDto } from './dto/route.dto';
import { UserRole } from '../../iam/enums/user-role.enum';

@Injectable()
export class RoutesService {
  constructor(
    @InjectRepository(Route)
    private readonly routeRepository: Repository<Route>,
    @InjectRepository(Stop)
    private readonly stopRepository: Repository<Stop>,
    @InjectRepository(RoutePath)
    private readonly routePathRepository: Repository<RoutePath>,
    private readonly dataSource: DataSource,
  ) {}

  async create(createDto: CreateRouteDto, currentUser: any) {
    if (currentUser.role !== UserRole.SUPERADMIN && !createDto.organizationId) {
      createDto.organizationId = currentUser.organizationId;
    }

    // Validate stops sequence if provided
    if (createDto.stops && createDto.stops.length > 0) {
      const sequences = createDto.stops.map(s => s.sequenceOrder).sort((a,b) => a - b);
      if (sequences[0] !== 1) throw new BadRequestException('El orden de paradas debe empezar en 1');
      for (let i = 0; i < sequences.length - 1; i++) {
        if (sequences[i+1] - sequences[i] !== 1) {
          throw new BadRequestException('El orden de paradas debe ser secuencial sin saltos');
        }
      }
    }

    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      // 1. Create Route
      const route = this.routeRepository.create({
        name: createDto.name,
        colorHex: createDto.colorHex,
        organizationId: createDto.organizationId,
      });
      const savedRoute = await queryRunner.manager.save(route);

      // 2. Create Stops inside transaction
      if (createDto.stops) {
        for (const stopData of createDto.stops) {
          const wktPoint = `SRID=4326;POINT(${stopData.lng} ${stopData.lat})`;
          const stop = this.stopRepository.create({
            routeId: savedRoute.id,
            name: stopData.name,
            sequenceOrder: stopData.sequenceOrder,
            radiusMeters: stopData.radiusMeters || 30.0,
          });
          // To save WKT correctly in TypeORM, we might need queryBuilder, but since we map to a geometry type, 
          // we can assign it as function output or string if handled by typeorm postgis
          // Safer way in transaction:
          await queryRunner.manager.query(
            `INSERT INTO stops (route_id, name, sequence_order, radius_meters, geom)
             VALUES ($1, $2, $3, $4, ST_GeomFromText($5, 4326))`,
             [savedRoute.id, stop.name, stop.sequenceOrder, stop.radiusMeters, `POINT(${stopData.lng} ${stopData.lat})`]
          );
        }
      }

      // 3. Create RoutePath if coordinates are provided
      if (createDto.pathCoordinates && createDto.pathCoordinates.length >= 2) {
        const lineString = createDto.pathCoordinates.map(c => `${c[0]} ${c[1]}`).join(', ');
        await queryRunner.manager.query(
          `INSERT INTO route_paths (route_id, path)
           VALUES ($1, ST_GeomFromText($2, 4326))`,
           [savedRoute.id, `LINESTRING(${lineString})`]
        );
      }

      await queryRunner.commitTransaction();
      return this.findOne(savedRoute.id, currentUser);
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await queryRunner.release();
    }
  }

  async findAll(currentUser: any): Promise<Route[]> {
    const where: any = { isActive: true };
    if (currentUser.role !== UserRole.SUPERADMIN) {
      where.organizationId = currentUser.organizationId;
    }
    return this.routeRepository.find({ where });
  }

  async findOne(id: string, currentUser: any) {
    const route = await this.routeRepository.findOne({ where: { id, isActive: true } });
    if (!route) throw new NotFoundException('Ruta no encontrada');

    if (currentUser.role !== UserRole.SUPERADMIN && route.organizationId !== currentUser.organizationId) {
       throw new ForbiddenException('No tienes permisos sobre esta ruta');
    }

    // Get stops
    const stops = await this.stopRepository.query(
      `SELECT id, name, sequence_order, radius_meters, ST_AsGeoJSON(geom) as geom 
       FROM stops WHERE route_id = $1 ORDER BY sequence_order ASC`,
      [route.id]
    );

    // Get path
    const path = await this.routePathRepository.query(
      `SELECT ST_AsGeoJSON(path) as path FROM route_paths WHERE route_id = $1 LIMIT 1`,
      [route.id]
    );

    return {
      ...route,
      stops: stops.map((s: any) => ({ ...s, geom: JSON.parse(s.geom) })),
      path: path.length > 0 ? JSON.parse(path[0].path) : null,
    };
  }

  async reorderStops(id: string, reorderDto: ReorderStopsDto, currentUser: any) {
    const route = await this.routeRepository.findOne({ where: { id, isActive: true } });
    if (!route) throw new NotFoundException('Ruta no encontrada');

    if (currentUser.role !== UserRole.SUPERADMIN && route.organizationId !== currentUser.organizationId) {
       throw new ForbiddenException('No tienes permisos para editar esta ruta');
    }

    const { stopIds } = reorderDto;
    
    // Validate count
    const existingStopsCount = await this.stopRepository.count({ where: { routeId: id } });
    if (stopIds.length !== existingStopsCount) {
       throw new BadRequestException('Debes proveer exactamente los mismos IDs existentes');
    }

    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      for (let i = 0; i < stopIds.length; i++) {
        await queryRunner.manager.update(Stop, { id: stopIds[i], routeId: id }, { sequenceOrder: i + 1 });
      }
      await queryRunner.commitTransaction();
      return { message: 'Paradas reordenadas exitosamente' };
    } catch (e) {
      await queryRunner.rollbackTransaction();
      throw e;
    } finally {
      await queryRunner.release();
    }
  }

  async remove(id: string, currentUser: any) {
    const route = await this.routeRepository.findOne({ where: { id, isActive: true } });
    if (!route) throw new NotFoundException('Ruta no encontrada');
    if (currentUser.role !== UserRole.SUPERADMIN && route.organizationId !== currentUser.organizationId) {
        throw new ForbiddenException('No tienes permisos');
    }
    route.isActive = false;
    await this.routeRepository.save(route);
  }
}
