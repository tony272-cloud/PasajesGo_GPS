"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var PartitionMaintenanceService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.PartitionMaintenanceService = void 0;
const common_1 = require("@nestjs/common");
const schedule_1 = require("@nestjs/schedule");
const typeorm_1 = require("typeorm");
let PartitionMaintenanceService = PartitionMaintenanceService_1 = class PartitionMaintenanceService {
    dataSource;
    logger = new common_1.Logger(PartitionMaintenanceService_1.name);
    constructor(dataSource) {
        this.dataSource = dataSource;
    }
    async onModuleInit() {
        this.logger.log('Iniciando mantenimiento de particiones de base de datos...');
        await this.ensurePartitions();
    }
    async handleMonthlyMaintenance() {
        this.logger.log('Ejecutando mantenimiento mensual de particiones...');
        await this.ensurePartitions();
    }
    async ensurePartitions() {
        const now = new Date();
        await this.createPartitionForMonth(now.getFullYear(), now.getMonth() + 1);
        const nextMonth = new Date(now.getFullYear(), now.getMonth() + 1, 1);
        await this.createPartitionForMonth(nextMonth.getFullYear(), nextMonth.getMonth() + 1);
        const afterNextMonth = new Date(now.getFullYear(), now.getMonth() + 2, 1);
        await this.createPartitionForMonth(afterNextMonth.getFullYear(), afterNextMonth.getMonth() + 1);
    }
    async createPartitionForMonth(year, month) {
        const monthStr = month.toString().padStart(2, '0');
        const tableName = `bus_positions_y${year}m${monthStr}`;
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
        }
        catch (error) {
            this.logger.error(`Error creando partición ${tableName}:`, error.message);
        }
    }
};
exports.PartitionMaintenanceService = PartitionMaintenanceService;
__decorate([
    (0, schedule_1.Cron)(schedule_1.CronExpression.EVERY_1ST_DAY_OF_MONTH_AT_MIDNIGHT),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], PartitionMaintenanceService.prototype, "handleMonthlyMaintenance", null);
exports.PartitionMaintenanceService = PartitionMaintenanceService = PartitionMaintenanceService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [typeorm_1.DataSource])
], PartitionMaintenanceService);
//# sourceMappingURL=partition-maintenance.service.js.map