import {
  createParamDecorator,
  ExecutionContext,
  SetMetadata,
} from '@nestjs/common';
import { Request } from 'express';
import { DecoratorKeyEnum } from 'src/constants/DecoratorKey';

export const RequireLogin = () =>
  SetMetadata(DecoratorKeyEnum.REQUIRE_LOGIN, true);

export const RequirePermission = (...permissions: string[]) =>
  SetMetadata(DecoratorKeyEnum.REQUIRE_PERMISSION, permissions);

export const UserInfo = createParamDecorator(
  (data: keyof JwtUserData, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest<Request>();

    if (!request.user) return null;

    return data ? request.user[data] : request.user;
  },
);
