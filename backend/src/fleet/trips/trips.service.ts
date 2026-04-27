import { Injectable, NotFoundException, BadRequestException, ForbiddenException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In } from 'typeorm';
import { Trip } from '../entities/trip.entity';
import { Bus } from '../entities/bus.entity';
import { BusPosition } from '../../telemetry/entities/bus-position.entity';
import { StartTripDto, EndTripDto } from './dto/trip.dto';
import { TripStatus } from '../enums/trip-status.enum';
import { UserRole } from '../../iam/enums/user-role.enum';

@Injectable()
export class TripsService {
  constructor(
    @InjectRepository(Trip)
    private readonly tripRepository: Repository<Trip>,
    @InjectRepository(Bus)
    private readonly busRepository: Repository<Bus>,
    @InjectRepository(BusPosition)
    private readonly positionRepository: Repository<BusPosition>,
  ) {}

  async startTrip(startDto: StartTripDto, currentUser: any) {
    const driverId = startDto.driverId || currentUser.id;

    // Check if the bus exists and is available
    const bus = await this.busRepository.findOne({ where: { id: startDto.busId } });
    if (!bus) throw new NotFoundException('Bus no encontrado');
    
    if (currentUser.role !== UserRole.SUPERADMIN && bus.organizationId !== currentUser.organizationId) {
       throw new ForbiddenException('No tienes permisos sobre este bus');
    }

    // Check if the bus already has an active trip
    const activeTrip = await this.tripRepository.findOne({
      where: {
        busId: startDto.busId,
        status: In([TripStatus.IN_PROGRESS, TripStatus.SCHEDULED]),
      },
    });

    if (activeTrip) {
      throw new BadRequestException('El bus ya tiene un viaje activo o programado');
    }

    // Check if driver has an active trip
    const activeDriverTrip = await this.tripRepository.findOne({
      where: {
        driverId: driverId,
        status: TripStatus.IN_PROGRESS,
      },
    });

    if (activeDriverTrip) {
      throw new BadRequestException('El conductor ya está en un viaje activo');
    }

    const newTrip = this.tripRepository.create({
      busId: startDto.busId,
      routeId: startDto.routeId,
      driverId: driverId,
      status: TripStatus.IN_PROGRESS,
      startedAt: new Date(),
    });

    return this.tripRepository.save(newTrip);
  }

  async endTrip(id: string, endDto: EndTripDto, currentUser: any) {
    const trip = await this.tripRepository.findOne({ 
      where: { id },
      relations: ['bus'] 
    });

    if (!trip) throw new NotFoundException('Viaje no encontrado');

    if (currentUser.role !== UserRole.SUPERADMIN && trip.bus?.organizationId !== currentUser.organizationId) {
      throw new ForbiddenException('No tienes permisos sobre este viaje');
    }

    if (trip.status === TripStatus.COMPLETED || trip.status === TripStatus.CANCELED) {
      throw new BadRequestException(`El viaje ya está ${trip.status}`);
    }

    trip.status = endDto.status;
    trip.endedAt = new Date();

    // Calculate basic metrics: Duration
    const durationMs = trip.endedAt.getTime() - (trip.startedAt?.getTime() || trip.endedAt.getTime());
    const durationMinutes = Math.round(durationMs / 60000);

    // To calculate total distance accurately involves querying POSTGIS for the length of a line made from positions
    // We will do a basic ST_Length over ST_MakeLine if positions exist
    let totalDistanceKm = 0;
    try {
      const result = await this.positionRepository.query(`
        WITH points AS (
          SELECT geom FROM bus_positions WHERE trip_id = $1 ORDER BY ts ASC
        )
        SELECT ST_Length(ST_MakeLine(geom)::geography) / 1000 AS distance_km
        FROM points
        HAVING COUNT(geom) > 1
      `, [trip.id]);
      
      if (result && result.length > 0) {
        totalDistanceKm = parseFloat(result[0].distance_km);
      }
    } catch (e) {
      // Ignore if no points or geometry errors
    }

    await this.tripRepository.save(trip);

    return {
      message: 'Viaje finalizado',
      tripId: trip.id,
      durationMinutes,
      totalDistanceKm: Number(totalDistanceKm.toFixed(2)),
    };
  }

  async findAll(currentUser: any, query: any) {
    // Implement pagination and filters
    const take = query.limit ? parseInt(query.limit) : 20;
    const skip = query.page ? (parseInt(query.page) - 1) * take : 0;
    
    // Using QueryBuilder to join and filter by organization easily
    const qb = this.tripRepository.createQueryBuilder('trip')
      .leftJoinAndSelect('trip.bus', 'bus')
      .leftJoinAndSelect('trip.route', 'route')
      .leftJoinAndSelect('trip.driver', 'driver')
      .take(take)
      .skip(skip)
      .orderBy('trip.createdAt', 'DESC');

    if (currentUser.role !== UserRole.SUPERADMIN) {
      qb.andWhere('bus.organizationId = :orgId', { orgId: currentUser.organizationId });
    }

    if (query.busId) qb.andWhere('trip.busId = :busId', { busId: query.busId });
    if (query.routeId) qb.andWhere('trip.routeId = :routeId', { routeId: query.routeId });
    if (query.driverId) qb.andWhere('trip.driverId = :driverId', { driverId: query.driverId });
    if (query.status) qb.andWhere('trip.status = :status', { status: query.status });

    const [data, total] = await qb.getManyAndCount();

    return {
      data,
      total,
      page: query.page || 1,
      limit: take,
    };
  }

  async findOne(id: string, currentUser: any) {
    const trip = await this.tripRepository.findOne({ 
      where: { id },
      relations: ['bus', 'route', 'driver'] 
    });

    if (!trip) throw new NotFoundException('Viaje no encontrado');
    if (currentUser.role !== UserRole.SUPERADMIN && trip.bus?.organizationId !== currentUser.organizationId) {
      throw new ForbiddenException('No tienes permisos');
    }

    return trip;
  }
}
