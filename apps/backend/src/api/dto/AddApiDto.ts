import { IsNotEmpty } from 'class-validator';

export class AddApiDto {
  @IsNotEmpty({
    message: 'api名称不能为空',
  })
  name: string;

  @IsNotEmpty({
    message: 'api 描述不能为空',
  })
  description: string;

  parentUid?: string;

  isDir?: boolean;
}
