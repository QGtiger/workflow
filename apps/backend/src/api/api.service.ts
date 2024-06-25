import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ApiMeta } from './entities/ApiMeta';
import { Repository } from 'typeorm';
import { EditApiDto } from './dto/EditApiDto';
import { AddApiDto } from './dto/AddApiDto';
import { v4 as uuidV4 } from 'uuid';

@Injectable()
export class ApiService {
  @InjectRepository(ApiMeta)
  private readonly apiMetaRepository: Repository<ApiMeta>;

  async addApi(dto: AddApiDto, id: number) {
    const { parentUid } = dto;
    let parent: ApiMeta | undefined;

    if (parentUid && parentUid !== 'root') {
      parent = await this.apiMetaRepository.findOneBy({
        uid: parentUid,
      });
      if (!parent) {
        throw new HttpException('父级目录不存在', HttpStatus.BAD_REQUEST);
      }
    }

    // const t = await this.apiMetaRepository.exists({
    //   where: {
    //     name: dto.name,
    //     user: {
    //       id,
    //     },
    //     parentUid: parentUid || 'root',
    //   },
    // });

    // if (t) {
    //   throw new HttpException(
    //     '同一文件夹下, 名称不能重复',
    //     HttpStatus.BAD_REQUEST,
    //   );
    // }

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

  async deleteApi(uid: string, id: number) {
    const item = await this.apiMetaRepository.findOneBy({
      uid,
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

  async queryAll(id: number) {
    const list = await this.apiMetaRepository.find({
      where: {
        user: {
          id,
        },
      },
    });

    return list.map((item) => {
      return {
        ...item,
        createTime: item.createTime.getTime(),
        updateTime: item.updateTime.getTime(),
      };
    });
  }

  async updateApiMeta(dto: EditApiDto, id: number) {
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
}
