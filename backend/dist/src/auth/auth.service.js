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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthService = void 0;
const common_1 = require("@nestjs/common");
const jwt_1 = require("@nestjs/jwt");
const config_1 = require("@nestjs/config");
const mongoose_1 = require("@nestjs/mongoose");
const bcrypt = require("bcrypt");
const mongoose_2 = require("mongoose");
const user_schema_1 = require("../users/schemas/user.schema");
const enums_1 = require("../common/enums");
let AuthService = class AuthService {
    constructor(userModel, jwtService, config) {
        this.userModel = userModel;
        this.jwtService = jwtService;
        this.config = config;
    }
    async hashPassword(password) {
        const rounds = parseInt(this.config.get('BCRYPT_ROUNDS', '10'), 10);
        return bcrypt.hash(password, rounds);
    }
    async validateUser(email, password) {
        const user = await this.userModel.findOne({ email }).exec();
        if (!user)
            return null;
        const ok = await bcrypt.compare(password, user.passwordHash);
        if (!ok)
            return null;
        if (!user.isActive)
            return null;
        return user;
    }
    async login(dto) {
        const user = await this.validateUser(dto.email, dto.password);
        if (!user)
            throw new common_1.UnauthorizedException('Invalid email or password');
        return this.buildTokenResponse(user);
    }
    async register(dto) {
        const existing = await this.userModel.findOne({ email: dto.email }).exec();
        if (existing)
            throw new common_1.ConflictException('Email already registered');
        const passwordHash = await this.hashPassword(dto.password);
        const user = await this.userModel.create({
            email: dto.email,
            passwordHash,
            name: dto.name,
            role: enums_1.UserRole.USER,
            position: dto.position,
            seniority: dto.seniority,
            isActive: true,
        });
        return { message: 'Registration successful.', userId: user._id };
    }
    async createUserByAdmin(dto) {
        const existing = await this.userModel.findOne({ email: dto.email }).exec();
        if (existing)
            throw new common_1.ConflictException('Email already registered');
        const passwordHash = await this.hashPassword(dto.password);
        const user = await this.userModel.create({
            email: dto.email,
            passwordHash,
            name: dto.name,
            role: enums_1.UserRole.USER,
            position: dto.position,
            seniority: dto.seniority,
            isActive: true,
        });
        return this.buildTokenResponse(user);
    }
    async refresh(refreshToken) {
        try {
            const payload = this.jwtService.verify(refreshToken, {
                secret: this.config.get('JWT_REFRESH_SECRET'),
            });
            if (payload.type !== 'refresh')
                throw new common_1.UnauthorizedException();
            const user = await this.userModel.findById(payload.sub).exec();
            if (!user?.isActive)
                throw new common_1.UnauthorizedException();
            return this.buildTokenResponse(user);
        }
        catch {
            throw new common_1.UnauthorizedException('Invalid or expired refresh token');
        }
    }
    buildTokenResponse(user) {
        const payload = { sub: user._id.toString(), email: user.email, role: user.role, type: 'access' };
        const refreshPayload = { sub: user._id.toString(), type: 'refresh' };
        const accessToken = this.jwtService.sign(payload);
        const refreshToken = this.jwtService.sign(refreshPayload, {
            secret: this.config.get('JWT_REFRESH_SECRET'),
            expiresIn: this.config.get('JWT_REFRESH_EXPIRES', '7d'),
        });
        return {
            accessToken,
            refreshToken,
            expiresIn: this.config.get('JWT_ACCESS_EXPIRES', '15m'),
            user: {
                id: user._id.toString(),
                email: user.email,
                name: user.name,
                role: user.role,
                position: user.position,
                seniority: user.seniority,
            },
        };
    }
};
exports.AuthService = AuthService;
exports.AuthService = AuthService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(user_schema_1.User.name)),
    __metadata("design:paramtypes", [mongoose_2.Model,
        jwt_1.JwtService,
        config_1.ConfigService])
], AuthService);
//# sourceMappingURL=auth.service.js.map