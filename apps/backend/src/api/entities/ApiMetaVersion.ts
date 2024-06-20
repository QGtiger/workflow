import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { ApiMeta } from './ApiMeta';

@Entity({
  name: 'api_meta_version',
})
export class ApiMetaVersion {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    default: 'v1',
  })
  version: `v${number}`;

  @Column()
  description: string;

  @CreateDateColumn({
    comment: '创建时间',
  })
  createTime: Date;

  @UpdateDateColumn({
    comment: '更新时间',
  })
  updateTime: Date;

  @Column()
  meta: string;

  @ManyToOne(() => ApiMeta, (apiMeta) => apiMeta.versions, {
    cascade: true,
  })
  apiMeta: ApiMeta;
}
