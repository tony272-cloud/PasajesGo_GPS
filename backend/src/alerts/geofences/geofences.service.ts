import { Injectable, NotFoundException, ForbiddenException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Geofence } from '../entities/geofence.entity';
import { CreateGeofenceDto, UpdateGeofenceDto } from './dto/geofence.dto';
import { UserRole } from '../../iam/enums/user-role.enum';

@Injectable()
export class GeofencesService {
  constructor(
    @InjectRepository(Geofence)
    private readonly geofenceRepository: Repository<Geofence>,
  ) {}

  private extractWKT(polygonCoordinates: number[][][]) {
    try {
      const rings = polygonCoordinates.map(
        ring => '(' + ring.map(p => `${p[0]} ${p[1]}`).join(', ') + ')'
      );
      return `POLYGON(${rings.join(', ')})`;
    } catch {
      throw new BadRequestException('Formato de polígono inválido. Debe ser un arreglo 3D donde la primera y última coordenada coincidan.');
    }
  }

  async create(createDto: CreateGeofenceDto, currentUser: any) {
    if (currentUser.role !== UserRole.SUPERADMIN && !createDto.organizationId) {
      createDto.organizationId = currentUser.organizationId;
    }

    const { polygonCoordinates, ...rest } = createDto;
    const geom = this.extractWKT(polygonCoordinates);

    const geofence = this.geofenceRepository.create({
      ...rest,
      geom,
    });

    return this.geofenceRepository.save(geofence);
  }

  async findAll(currentUser: any) {
    const where: any = {};
    if (currentUser.role !== UserRole.SUPERADMIN) {
      where.organizationId = currentUser.organizationId;
    }
    
    // We want to return GeoJSON instead of raw WKT to the frontend
    const geofences = await this.geofenceRepository.query(`
      SELECT id, name, organization_id as "organizationId", alert_type as "alertType", created_at as "createdAt", ST_AsGeoJSON(geom) as geom
      FROM geofences
      WHERE ${where.organizationId ? `organization_id = '${where.organizationId}'` : '1=1'}
    `);

    return geofences.map((g: any) => ({ ...g, geom: JSON.parse(g.geom) }));
  }

  async findOne(id: string, currentUser: any) {
    const query = this.geofenceRepository.createQueryBuilder('g')
      .select('g.id', 'id')
      .addSelect('g.name', 'name')
      .addSelect('g.organizationId', 'organizationId')
      .addSelect('g.alertType', 'alertType')
      .addSelect('g.createdAt', 'createdAt')
      .addSelect('ST_AsGeoJSON(g.geom)', 'geom')
      .where('g.id = :id', { id });

    const geofenceRaw = await query.getRawOne();
    
    if (!geofenceRaw) throw new NotFoundException('Geocerca no encontrada');

    if (currentUser.role !== UserRole.SUPERADMIN && geofenceRaw.organizationId !== currentUser.organizationId) {
       throw new ForbiddenException('No tienes permisos sobre esta geocerca');
    }

    return { ...geofenceRaw, geom: JSON.parse(geofenceRaw.geom) };
  }

  async update(id: string, updateDto: UpdateGeofenceDto, currentUser: any) {
    const geofence = await this.geofenceRepository.findOne({ where: { id }});
    if (!geofence) throw new NotFoundException('Geocerca no encontrada');

    if (currentUser.role !== UserRole.SUPERADMIN && geofence.organizationId !== currentUser.organizationId) {
      throw new ForbiddenException('No tienes permisos sobre esta geocerca');
    }

    if (updateDto.name) geofence.name = updateDto.name;
    if (updateDto.alertType) geofence.alertType = updateDto.alertType;
    if (updateDto.polygonCoordinates) {
      geofence.geom = this.extractWKT(updateDto.polygonCoordinates);
    }

    return this.geofenceRepository.save(geofence);
  }

  async remove(id: string, currentUser: any) {
    const geofence = await this.geofenceRepository.findOne({ where: { id }});
    if (!geofence) throw new NotFoundException('Geocerca no encontrada');

    if (currentUser.role !== UserRole.SUPERADMIN && geofence.organizationId !== currentUser.organizationId) {
      throw new ForbiddenException('No tienes permisos sobre esta geocerca');
    }

    await this.geofenceRepository.delete(id);
  }
}
