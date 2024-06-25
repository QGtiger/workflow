import { Body, Controller, Get, Post, Query, UseGuards } from '@nestjs/common';
import { ApiService } from './api.service';
import { AddApiDto } from './dto/AddApiDto';
import { RequireLogin, UserInfo } from 'src/common/custom.decorator';
import { LoginGuard } from 'src/login.guard';
import { ApiMeta } from './entities/ApiMeta';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/user/entities/User';
import { EditApiDto } from './dto/EditApiDto';
import { DeleteApiDto } from './dto/DeleteApiDto';

@RequireLogin()
@UseGuards(LoginGuard)
@Controller('api')
export class ApiController {
  constructor(private readonly apiService: ApiService) {}

  @InjectRepository(ApiMeta)
  private readonly apiMetaRepository: Repository<ApiMeta>;

  @InjectRepository(User)
  private readonly userRepository: Repository<User>;

  @Post('add')
  async addApi(@Body() dto: AddApiDto, @UserInfo('id') id) {
    return this.apiService.addApi(dto, id);
  }

  @Post('delete')
  async deleteApi(@Body() dto: DeleteApiDto, @UserInfo('id') id) {
    return this.apiService.deleteApi(dto.uid, id);
  }

  @Post('update')
  async updateApi(@Body() dto: EditApiDto, @UserInfo('id') id) {
    return this.apiService.updateApiMeta(dto, id);
  }

  @Get('query')
  async getFolders(@Query('parentUid') parentUid: string, @UserInfo('id') id) {
    const _parentUid = parentUid || 'root';

    const list = await this.apiMetaRepository.find({
      where: {
        user: {
          id,
        },
        parentUid: _parentUid,
      },
      // relations: ['children'],
      // join: {
      //   alias: 'apiMeta',
      //   leftJoinAndSelect: {
      //     children: 'apiMeta.children',
      //     grandchildren: 'children.children',
      //   },
      // },
    });

    return list.map((item) => {
      return {
        ...item,
        createTime: item.createTime.getTime(),
        updateTime: item.updateTime.getTime(),
      };
    });
  }

  @Get('queryAll')
  async queryAll(@UserInfo('id') id) {
    return this.apiService.queryAll(id);
  }
}
