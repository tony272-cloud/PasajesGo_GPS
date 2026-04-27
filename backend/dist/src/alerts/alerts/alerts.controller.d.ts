import { AlertsService } from './alerts.service';
export declare class AlertsController {
    private readonly alertsService;
    constructor(alertsService: AlertsService);
    findAll(user: any, query: any): Promise<{
        data: import("../entities/alert.entity").Alert[];
        total: number;
        page: any;
        limit: number;
    }>;
    resolve(id: string, user: any): Promise<import("../entities/alert.entity").Alert>;
}
