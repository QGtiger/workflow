import {
  Body,
  Controller,
  Get,
  Inject,
  Post,
  Query,
  UnauthorizedException,
} from '@nestjs/common';
import { UserService } from './user.service';
import { RegisterUserDto } from './dto/RegisterUserDto';
import { LoginUserDto } from './dto/LoginUserDto';
import { JwtService } from '@nestjs/jwt';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Inject(JwtService)
  private jwtService: JwtService;

  @Post('register')
  async register(@Body() registerUser: RegisterUserDto) {
    return this.userService.register(registerUser);
  }

  @Post('login')
  async login(@Body() loginUser: LoginUserDto) {
    return this.userService.login(loginUser);
  }

  @Get('refreshToken')
  async refreshToken(@Query('refreshToken') refreshToken: string) {
    try {
      const payload: {
        userId: number;
      } = this.jwtService.verify(refreshToken);

      const user = await this.userService.findUserById(payload.userId);

      this.userService.generateJwtToken(user);

      return this.userService.generateJwtToken(user);
    } catch (e) {
      throw new UnauthorizedException('refreshToken 无效');
    }
  }

  @Get('initdata')
  async initDBData() {
    return this.userService.initDBData();
  }
}
