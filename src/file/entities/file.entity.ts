import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, BaseEntity } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { Folder } from '../../folder/entities/folder.entity';
import { AbstractEntity } from '../../common/base.entity';

@Entity()
export class File extends AbstractEntity {
  @PrimaryGeneratedColumn()
  @ApiProperty({ example: 1, description: 'Unique identifier for the file' })
  id: number;

  @Column()
  @ApiProperty({ example: 'document.pdf', description: 'Name of the file' })
  name: string;

  @Column()
  @ApiProperty({ example: 'important file', description: 'Description of the file' })
  description: string;

  @Column()
  @ApiProperty({ example: 'pdf', description: 'Type of the file (extension)' })
  fileType: string;

  @Column()
  @ApiProperty({ example: '/uploads/document.pdf', description: 'Path where the file is stored' })
  filePath: string;

  @ManyToOne(() => Folder, (folder) => folder.files, { onDelete: 'CASCADE' })
  @ApiProperty({ example: 1, description: 'ID of the folder containing the file' })
  folder: Folder;
}
