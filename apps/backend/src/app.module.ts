import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserModule } from './user/user.module';
import { User } from './user/entities/User';
import { Role } from './user/entities/Role';
import { Permission } from './user/entities/Permission';
import { RedisModule } from './redis/redis.module';
import { EmailModule } from './email/email.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { APP_FILTER, APP_INTERCEPTOR } from '@nestjs/core';
import { CommonFilter } from './common/common.filter';
import { CommonInterceptor } from './common/common.interceptor';
import { JwtModule } from '@nestjs/jwt';
import { ApiModule } from './api/api.module';
import { ApiMeta } from './api/entities/ApiMeta';
import { ApiMetaVersion } from './api/entities/ApiMetaVersion';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: 'src/.env',
    }),
    JwtModule.registerAsync({
      global: true,
      useFactory(configService: ConfigService) {
        return {
          secret: configService.get('JWT_SECRET'),
        };
      },
      inject: [ConfigService],
    }),
    TypeOrmModule.forRootAsync({
      useFactory(configService: ConfigService) {
        return {
          type: 'mysql',
          host: configService.get('MYSQL_SERVER_HOST'),
          port: configService.get('MYSQL_SERVER_PORT'),
          username: configService.get('MYSQL_SERVER_USER'),
          password: configService.get('MYSQL_SERVER_PASSWORD'),
          database: configService.get('MYSQL_SERVER_DB'),
          synchronize: true,
          logging: true,
          entities: [User, Role, Permission, ApiMeta, ApiMetaVersion],
          poolSize: 10,
          connectorPackage: 'mysql2',
          extra: {
            authPlugins: 'sha256_password',
          },
        };
      },
      inject: [ConfigService],
    }),
    UserModule,
    RedisModule,
    EmailModule,
    ApiModule,
  ],
  providers: [
    {
      provide: APP_FILTER,
      useClass: CommonFilter,
    },
    {
      provide: APP_INTERCEPTOR,
      useClass: CommonInterceptor,
    },
  ],
})
export class AppModule {}
