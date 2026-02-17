import { KpiService } from './kpi.service';
import { CreateKpiDto } from './dto/create-kpi.dto';
import { UpdateKpiDto } from './dto/update-kpi.dto';
import { UpsertKpiResultDto } from './dto/upsert-kpi-result.dto';
export declare class KpiController {
    private readonly kpiService;
    constructor(kpiService: KpiService);
    getMyKpis(userId: string, periodStart: string, periodEnd: string): Promise<{
        kpi: import("mongoose").FlattenMaps<import("./schemas/kpi.schema").Kpi> & Required<{
            _id: import("mongoose").Types.ObjectId;
        }> & {
            __v: number;
        };
        result: (import("mongoose").FlattenMaps<import("./schemas/kpi-result.schema").KpiResult> & Required<{
            _id: import("mongoose").Types.ObjectId;
        }> & {
            __v: number;
        }) | null;
    }[]>;
    findAll(position?: string, seniority?: string): Promise<(import("mongoose").FlattenMaps<import("./schemas/kpi.schema").Kpi> & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    })[]>;
    findOne(id: string): Promise<import("mongoose").FlattenMaps<import("./schemas/kpi.schema").Kpi> & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    }>;
    create(dto: CreateKpiDto): Promise<import("./schemas/kpi.schema").Kpi & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    }>;
    update(id: string, dto: UpdateKpiDto): Promise<import("mongoose").FlattenMaps<import("./schemas/kpi.schema").Kpi> & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    }>;
    remove(id: string): Promise<{
        message: string;
    }>;
    upsertResult(adminId: string, userId: string, kpiId: string, dto: UpsertKpiResultDto): Promise<(import("./schemas/kpi-result.schema").KpiResult & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    }) | (import("mongoose").FlattenMaps<import("./schemas/kpi-result.schema").KpiResult> & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    }) | null>;
    recalculate(userId: string, periodStart: string, periodEnd: string): Promise<{
        kpiId: string;
        score: number;
    }[]>;
}
