import { Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';
import { Model } from 'mongoose';
import { User } from '../../users/schemas/user.schema';
import { JwtPayload } from '../../common/decorators/current-user.decorator';
declare const JwtStrategy_base: new (...args: any[]) => Strategy;
export declare class JwtStrategy extends JwtStrategy_base {
    private config;
    private userModel;
    constructor(config: ConfigService, userModel: Model<User>);
    validate(payload: {
        sub: string;
        email: string;
    }): Promise<JwtPayload>;
}
export {};
