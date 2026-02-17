import { Injectable, UnauthorizedException, ConflictException, BadRequestException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { InjectModel } from '@nestjs/mongoose';
import * as bcrypt from 'bcrypt';
import { Model } from 'mongoose';
import { User } from '../users/schemas/user.schema';
import { UserRole } from '../common/enums';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(User.name) private userModel: Model<User>,
    private jwtService: JwtService,
    private config: ConfigService,
  ) { }

  private async hashPassword(password: string): Promise<string> {
    const rounds = parseInt(this.config.get<string>('BCRYPT_ROUNDS', '10'), 10);
    return bcrypt.hash(password, rounds);
  }

  async validateUser(email: string, password: string): Promise<User | null> {
    const user = await this.userModel.findOne({ email }).exec();
    if (!user) return null;
    const ok = await bcrypt.compare(password, user.passwordHash);
    if (!ok) return null;
    if (!user.isActive) return null; // Or throw specific error if strategy supports it
    return user;
  }

  async login(dto: LoginDto) {
    const user = await this.validateUser(dto.email, dto.password);
    if (!user) throw new UnauthorizedException('Invalid email or password');
    return this.buildTokenResponse(user);
  }

  async register(dto: RegisterDto) {
    const existing = await this.userModel.findOne({ email: dto.email }).exec();
    if (existing) throw new ConflictException('Email already registered');
    const passwordHash = await this.hashPassword(dto.password);
    const user = await this.userModel.create({
      email: dto.email,
      passwordHash,
      name: dto.name,
      role: UserRole.USER,
      position: dto.position,
      seniority: dto.seniority,
      isActive: true, // Auto-approve new registrations
    });
    return { message: 'Registration successful.', userId: user._id };
  }

  async createUserByAdmin(dto: RegisterDto) {
    const existing = await this.userModel.findOne({ email: dto.email }).exec();
    if (existing) throw new ConflictException('Email already registered');
    const passwordHash = await this.hashPassword(dto.password);
    const user = await this.userModel.create({
      email: dto.email,
      passwordHash,
      name: dto.name,
      role: UserRole.USER,
      position: dto.position,
      seniority: dto.seniority,
      isActive: true,
    });
    return this.buildTokenResponse(user);
  }

  async refresh(refreshToken: string) {
    try {
      const payload = this.jwtService.verify(refreshToken, {
        secret: this.config.get<string>('JWT_REFRESH_SECRET'),
      });
      if (payload.type !== 'refresh') throw new UnauthorizedException();
      const user = await this.userModel.findById(payload.sub).exec();
      if (!user?.isActive) throw new UnauthorizedException();
      return this.buildTokenResponse(user);
    } catch {
      throw new UnauthorizedException('Invalid or expired refresh token');
    }
  }

  private buildTokenResponse(user: User) {
    const payload = { sub: user._id.toString(), email: user.email, role: user.role, type: 'access' };
    const refreshPayload = { sub: user._id.toString(), type: 'refresh' };
    const accessToken = this.jwtService.sign(payload);
    const refreshToken = this.jwtService.sign(refreshPayload, {
      secret: this.config.get<string>('JWT_REFRESH_SECRET'),
      expiresIn: this.config.get<string>('JWT_REFRESH_EXPIRES', '7d'),
    });
    return {
      accessToken,
      refreshToken,
      expiresIn: this.config.get<string>('JWT_ACCESS_EXPIRES', '15m'),
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
}
