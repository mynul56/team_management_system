export interface JwtPayload {
    sub: string;
    email: string;
    role: string;
    type: 'access' | 'refresh';
}
export declare const CurrentUser: (...dataOrPipes: (import("@nestjs/common").PipeTransform<any, any> | import("@nestjs/common").Type<import("@nestjs/common").PipeTransform<any, any>> | keyof JwtPayload | undefined)[]) => ParameterDecorator;
