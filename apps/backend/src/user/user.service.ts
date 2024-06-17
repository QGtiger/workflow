import { HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/User';
import { Repository } from 'typeorm';
import { RegisterUserDto } from './dto/RegisterUserDto';
import { RedisService } from 'src/redis/redis.service';
import { md5 } from 'src/utils';
import { Role } from './entities/Role';
import { Permission } from './entities/Permission';
import { LoginUserDto } from './dto/LoginUserDto';
import { LoginUserVo } from './vo/login-user.vo';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class UserService {
  @InjectRepository(User)
  private userRepository: Repository<User>;

  @InjectRepository(Role)
  private roleRepository: Repository<Role>;

  @InjectRepository(Permission)
  private permissionRepository: Repository<Permission>;

  @Inject(RedisService)
  private redisService: RedisService;

  @Inject(ConfigService)
  private configService: ConfigService;

  @Inject(JwtService)
  private jwtService: JwtService;

  generateJwtToken(user: User) {
    const payload = this.getJwtPayloadByUser(user);
    return {
      accessToken: this.jwtService.sign(payload, {
        expiresIn: this.configService.get('JWT_ACCESS_TOKEN_EXPIRES_TIME'),
      }),
      refreshToken: this.jwtService.sign(
        {
          userId: payload.id,
        },
        {
          expiresIn: this.configService.get('JWT_REFRESH_TOKEN_EXPIRES_TIME'),
        },
      ),
    };
  }

  getJwtPayloadByUser(user: User): JwtUserData {
    return {
      id: user.id,
      username: user.username,
      email: user.email,
      isAdmin: user.isAdmin,
      createTime: user.createTime.getTime(),
      roles: user.roles.map((role) => role.name),
      permissions: user.roles.reduce((acc, cur) => {
        cur.permissions.forEach((permission) => {
          acc.push(permission.code);
        });
        return acc;
      }, []),
    };
  }

  // 初始化数据库数据
  async initDBData() {
    const user1 = new User();
    user1.username = 'zhangsan';
    user1.password = md5('111111');
    user1.email = 'xxx@xx.com';
    user1.isAdmin = true;

    const user2 = new User();
    user2.username = 'lisi';
    user2.password = md5('222222');
    user2.email = 'yy@yy.com';

    const role1 = new Role();
    role1.name = '管理员';
    role1.description = '管理员角色';

    const role2 = new Role();
    role2.name = '普通用户';
    role2.description = '普通用户角色';

    const permission1 = new Permission();
    permission1.code = 'ccc';
    permission1.description = '访问 ccc 接口';

    const permission2 = new Permission();
    permission2.code = 'ddd';
    permission2.description = '访问 ddd 接口';

    user1.roles = [role1];
    user2.roles = [role2];

    role1.permissions = [permission1, permission2];
    role2.permissions = [permission1];

    await this.permissionRepository.save([permission1, permission2]);
    await this.roleRepository.save([role1, role2]);
    await this.userRepository.save([user1, user2]);
  }

  async login(user: LoginUserDto) {
    const foundUser = await this.userRepository.findOne({
      where: {
        username: user.username,
      },
      relations: ['roles', 'roles.permissions'],
    });

    if (!foundUser) {
      throw new HttpException('用户不存在', HttpStatus.BAD_REQUEST);
    }

    if (foundUser.password !== md5(user.password)) {
      throw new HttpException('密码错误', HttpStatus.BAD_REQUEST);
    }

    const vo = new LoginUserVo();
    vo.userInfo = this.getJwtPayloadByUser(foundUser);

    const tokenConfig = this.generateJwtToken(foundUser);

    vo.accessToken = tokenConfig.accessToken;
    vo.refreshToken = tokenConfig.refreshToken;

    return vo;
  }

  async findUserById(id: number) {
    return this.userRepository.findOne({
      where: {
        id,
      },
      relations: ['roles', 'roles.permissions'],
    });
  }

  async register(user: RegisterUserDto) {
    const captcha = await this.redisService.get(`captcha_${user.email}`);

    if (!captcha) {
      throw new HttpException('验证码已失效', HttpStatus.BAD_REQUEST);
    }

    if (user.captcha !== captcha) {
      throw new HttpException('验证码错误', HttpStatus.BAD_REQUEST);
    }

    const foundUser = await this.userRepository.findOneBy({
      username: user.username,
    });

    if (foundUser) {
      throw new HttpException('用户名已存在', HttpStatus.BAD_REQUEST);
    }

    const newUser = this.userRepository.create({
      ...user,
      password: md5(user.password),
    });

    await this.userRepository.save(newUser);

    return newUser;
  }
}
