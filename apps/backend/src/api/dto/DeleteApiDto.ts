import { IsNotEmpty } from 'class-validator';

export class DeleteApiDto {
  @IsNotEmpty({
    message: 'api uid不能为空',
  })
  uid: string;
}
