import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity({
  name: 'permissions',
  comment: '权限表',
})
export class Permission {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    comment: '权限名',
  })
  code: string;

  @Column({
    comment: '描述',
    length: 100,
  })
  description: string;
}
