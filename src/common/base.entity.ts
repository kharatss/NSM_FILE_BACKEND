import { CreateDateColumn, UpdateDateColumn,BaseEntity } from 'typeorm';

export abstract class AbstractEntity extends BaseEntity {
  @CreateDateColumn({ name: 'created_at', default: () => 'GETDATE()', nullable: false })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at', default: () => 'GETDATE()', nullable: false })
  updatedAt: Date;
}