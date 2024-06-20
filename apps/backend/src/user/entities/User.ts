import {
  Column,
  CreateDateColumn,
  Entity,
  JoinTable,
  ManyToMany,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Role } from './Role';
import { ApiMeta } from 'src/api/entities/ApiMeta';

@Entity({
  name: 'users',
  comment: '用户表',
})
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    comment: '用户名',
    length: 50,
  })
  username: string;

  @Column({
    comment: '密码',
  })
  password: string;

  @Column({
    comment: '邮箱',
    length: 50,
  })
  email: string;

  @Column({
    comment: '是否是管理员',
    default: false,
  })
  isAdmin: boolean;

  @CreateDateColumn({
    comment: '创建时间',
  })
  createTime: Date;

  @UpdateDateColumn({
    comment: '更新时间',
  })
  updateTime: Date;

  @ManyToMany(() => Role)
  @JoinTable({
    name: 'user_role',
  })
  roles: Role[];

  @OneToMany(() => ApiMeta, (ApiMeta) => ApiMeta.user)
  apiMetas: ApiMeta[];
}
