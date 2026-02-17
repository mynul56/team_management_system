import { Position, Seniority } from '../../common/enums';
import { KpiMeasurementType } from '../../common/enums';
export declare class CreateKpiDto {
    name: string;
    weight: number;
    measurementType?: KpiMeasurementType;
    positions?: Position[];
    seniorities?: Seniority[];
    description?: string;
}
