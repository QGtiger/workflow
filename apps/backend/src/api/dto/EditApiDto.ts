import { IsNotEmpty } from 'class-validator';

export class EditApiDto {
  name: string;
  description: string;

  parentUid?: string;

  @IsNotEmpty({
    message: 'api uid不能为空',
  })
  uid: string;
}
