import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { Model } from 'mongoose';
import { User } from '../users/schemas/user.schema';
import { UserRole } from '../common/enums';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
export declare class AuthService {
    private userModel;
    private jwtService;
    private config;
    constructor(userModel: Model<User>, jwtService: JwtService, config: ConfigService);
    private hashPassword;
    validateUser(email: string, password: string): Promise<User | null>;
    login(dto: LoginDto): Promise<{
        accessToken: string;
        refreshToken: string;
        expiresIn: string;
        user: {
            id: string;
            email: string;
            name: string;
            role: UserRole;
            position: import("../common/enums").Position;
            seniority: import("../common/enums").Seniority;
        };
    }>;
    register(dto: RegisterDto): Promise<{
        message: string;
        userId: import("mongoose").Types.ObjectId;
    }>;
    createUserByAdmin(dto: RegisterDto): Promise<{
        accessToken: string;
        refreshToken: string;
        expiresIn: string;
        user: {
            id: string;
            email: string;
            name: string;
            role: UserRole;
            position: import("../common/enums").Position;
            seniority: import("../common/enums").Seniority;
        };
    }>;
    refresh(refreshToken: string): Promise<{
        accessToken: string;
        refreshToken: string;
        expiresIn: string;
        user: {
            id: string;
            email: string;
            name: string;
            role: UserRole;
            position: import("../common/enums").Position;
            seniority: import("../common/enums").Seniority;
        };
    }>;
    private buildTokenResponse;
}
