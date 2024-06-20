import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { ApiMetaVersion } from './ApiMetaVersion';
import { User } from 'src/user/entities/User';

@Entity({
  name: 'api_meta_v1',
  comment: 'api目录元数据表',
})
export class ApiMeta {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    comment: '名称',
  })
  name: string;

  @Column({
    comment: '唯一标识',
  })
  uid: string;

  @Column()
  description: string;

  @Column({
    type: 'boolean',
    default: true,
    comment: '是否是目录',
  })
  isDir: boolean;

  @CreateDateColumn({
    comment: '创建时间',
  })
  createTime: Date;

  @UpdateDateColumn({
    comment: '更新时间',
  })
  updateTime: Date;

  @ManyToOne(() => User)
  user: User;

  @Column({
    comment: '父级目录',
    default: 'root',
  })
  parentUid: string;

  @ManyToOne(() => ApiMeta, (apiMeta) => apiMeta.children, {
    cascade: true,
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  parent: ApiMeta;

  @OneToMany(() => ApiMeta, (apiMeta) => apiMeta.parent)
  children: ApiMeta[];

  @JoinColumn()
  @OneToOne(() => ApiMetaVersion)
  version: ApiMetaVersion;

  @OneToMany(() => ApiMetaVersion, (apiMetaVersion) => apiMetaVersion.apiMeta)
  versions: ApiMetaVersion[];
}
