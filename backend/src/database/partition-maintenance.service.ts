import { Injectable, OnModuleInit, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { DataSource } from 'typeorm';

@Injectable()
export class PartitionMaintenanceService implements OnModuleInit {
  private readonly logger = new Logger(PartitionMaintenanceService.name);

  constructor(private readonly dataSource: DataSource) {}

  async onModuleInit() {
    this.logger.log('Iniciando mantenimiento de particiones de base de datos...');
    await this.ensurePartitions();
  }

  @Cron(CronExpression.EVERY_1ST_DAY_OF_MONTH_AT_MIDNIGHT)
  async handleMonthlyMaintenance() {
    this.logger.log('Ejecutando mantenimiento mensual de particiones...');
    await this.ensurePartitions();
  }

  /**
   * Asegura que existan particiones para el mes actual y el siguiente
   */
  async ensurePartitions() {
    const now = new Date();
    
    // Crear para el mes actual
    await this.createPartitionForMonth(now.getFullYear(), now.getMonth() + 1);
    
    // Crear para el próximo mes (proactivo)
    const nextMonth = new Date(now.getFullYear(), now.getMonth() + 1, 1);
    await this.createPartitionForMonth(nextMonth.getFullYear(), nextMonth.getMonth() + 1);

    // Crear para el mes subsiguiente (más proactivo)
    const afterNextMonth = new Date(now.getFullYear(), now.getMonth() + 2, 1);
    await this.createPartitionForMonth(afterNextMonth.getFullYear(), afterNextMonth.getMonth() + 1);
  }

  private async createPartitionForMonth(year: number, month: number) {
    const monthStr = month.toString().padStart(2, '0');
    const tableName = `bus_positions_y${year}m${monthStr}`;
    
    // Rango de fechas
    const startDate = `${year}-${monthStr}-01`;
    const nextDate = new Date(year, month, 1);
    const endDate = `${nextDate.getFullYear()}-${(nextDate.getMonth() + 1).toString().padStart(2, '0')}-01`;

    const sql = `
      CREATE TABLE IF NOT EXISTS ${tableName} PARTITION OF bus_positions
      FOR VALUES FROM ('${startDate}') TO ('${endDate}');
    `;

    try {
      await this.dataSource.query(sql);
      this.logger.debug(`Verificada/Creada partición: ${tableName} (${startDate} a ${endDate})`);
    } catch (error) {
      this.logger.error(`Error creando partición ${tableName}:`, error.message);
    }
  }
}
