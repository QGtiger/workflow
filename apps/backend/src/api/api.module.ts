import { Module } from '@nestjs/common';
import { ApiService } from './api.service';
import { ApiController } from './api.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ApiMeta } from './entities/ApiMeta';
import { ApiMetaVersion } from './entities/ApiMetaVersion';
import { User } from 'src/user/entities/User';

@Module({
  imports: [TypeOrmModule.forFeature([ApiMeta, ApiMetaVersion, User])],
  controllers: [ApiController],
  providers: [ApiService],
})
export class ApiModule {}
