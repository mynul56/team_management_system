import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import { UserRole } from '../common/enums';
export declare class AuthController {
    private readonly authService;
    constructor(authService: AuthService);
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
    createUser(dto: RegisterDto): Promise<{
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
}
