import {
  Body,
  Controller,
  Delete,
  Get,
  HttpException,
  HttpStatus,
  Inject,
  ParseIntPipe,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ApiService } from './api.service';
import { AddApiDto } from './dto/AddApiDto';
import { RequireLogin, UserInfo } from 'src/common/custom.decorator';
import { LoginGuard } from 'src/login.guard';
import { ApiMeta } from './entities/ApiMeta';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/user/entities/User';
import { v4 as uuidV4 } from 'uuid';
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
    const { parentUid } = dto;
    let parent: ApiMeta | undefined;

    if (parentUid) {
      parent = await this.apiMetaRepository.findOneBy({
        uid: parentUid,
      });
      if (!parent) {
        throw new HttpException('父级目录不存在', HttpStatus.BAD_REQUEST);
      }
    }

    const t = await this.apiMetaRepository.exists({
      where: {
        name: dto.name,
        user: {
          id,
        },
        parentUid: parentUid || 'root',
      },
    });

    if (t) {
      throw new HttpException(
        '同一文件夹下, 名称不能重复',
        HttpStatus.BAD_REQUEST,
      );
    }

    const newItem = this.apiMetaRepository.create({
      ...dto,
      user: {
        id,
      },
      parent,
      parentUid: parentUid || 'root',
      uid: uuidV4(),
    });
    await this.apiMetaRepository.save(newItem);
    return '添加成功';
  }

  @Post('delete')
  async deleteApi(@Body() dto: DeleteApiDto, @UserInfo('id') id) {
    const item = await this.apiMetaRepository.findOneBy({
      uid: dto.uid,
      user: {
        id,
      },
    });

    if (!item) {
      throw new HttpException('目录不存在', HttpStatus.BAD_REQUEST);
    }

    await this.apiMetaRepository.delete(item.id);

    return '删除成功';
  }

  @Post('update')
  async updateApi(@Body() dto: EditApiDto, @UserInfo('id') id) {
    const { uid, parentUid } = dto;
    if (uid === parentUid) {
      throw new HttpException('不能将目录移动到自身', HttpStatus.BAD_REQUEST);
    }
    const item = await this.apiMetaRepository.findOne({
      where: {
        uid,
        user: {
          id,
        },
      },
      relations: ['parent'],
    });

    if (!item) {
      throw new HttpException('目录不存在', HttpStatus.BAD_REQUEST);
    }

    if (parentUid) {
      let newParent: ApiMeta;
      if (parentUid !== 'root') {
        newParent = await this.apiMetaRepository.findOne({
          where: {
            uid: parentUid,
          },
        });

        if (!newParent) {
          throw new HttpException('父级目录不存在', HttpStatus.BAD_REQUEST);
        }
      }

      // 添加到新的父级目录 children中
      item.parent = newParent || null;
    }

    Object.assign(item, dto);

    await this.apiMetaRepository.save(item);

    return '更新成功';
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
}
