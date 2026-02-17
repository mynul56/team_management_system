import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { DailyUpdate, DailyUpdateSchema } from './schemas/daily-update.schema';
import { DailyUpdatesController } from './daily-updates.controller';
import { DailyUpdatesService } from './daily-updates.service';

@Module({
  imports: [MongooseModule.forFeature([{ name: DailyUpdate.name, schema: DailyUpdateSchema }])],
  controllers: [DailyUpdatesController],
  providers: [DailyUpdatesService],
  exports: [DailyUpdatesService],
})
export class DailyUpdatesModule {}
