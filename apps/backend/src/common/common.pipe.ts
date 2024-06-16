import { ArgumentMetadata, Injectable, PipeTransform } from '@nestjs/common';

@Injectable()
export class CommonPipe implements PipeTransform {
  transform(value: any, metadata: ArgumentMetadata) {
    // 定义全局返回结构
    return {
      success: true,
      code: 200,
      data: value,
    };
  }
}
