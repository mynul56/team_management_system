import { Controller, Get } from '@nestjs/common';
import { Public } from './common/decorators/public.decorator';

@Controller()
export class AppController {
    @Public()
    @Get()
    getHello(): { message: string } {
        return { message: 'Team Management System API is running' };
    }
}
