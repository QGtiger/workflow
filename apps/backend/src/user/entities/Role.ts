import {
  Column,
  Entity,
  JoinTable,
  ManyToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Permission } from './Permission';

@Entity({
  name: 'roles',
  comment: '角色表',
})
export class Role {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    comment: '角色名',
  })
  name: string;

  @Column({
    comment: '描述',
  })
  description: string;

  @ManyToMany(() => Permission)
  @JoinTable({
    name: 'role_permissions',
  })
  permissions: Permission[];
}
