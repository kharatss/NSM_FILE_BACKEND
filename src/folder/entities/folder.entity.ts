import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { File } from '../../file/entities/file.entity';
import { AbstractEntity } from '../../common/base.entity';

@Entity()
export class Folder extends AbstractEntity {
  @PrimaryGeneratedColumn()
  @ApiProperty({ example: 1, description: 'Unique identifier for the folder' })
  id: number;

  @Column()
  @ApiProperty({ example: 'Documents', description: 'Name of the folder' })
  name: string;

  @Column()
  @ApiProperty({ example: 'important folder', description: 'Description of the folder' })
  description: string;

  @ManyToOne(() => Folder, (folder) => folder.subFolders, { nullable: true, onDelete: 'CASCADE' })
  @ApiProperty({ example: 1, nullable: true, description: 'ID of the parent folder (if any)' })
  parentFolder: Folder;

  @OneToMany(() => Folder, (folder) => folder.parentFolder)
  @ApiProperty({ type: () => [Folder], description: 'List of subfolders inside this folder' })
  subFolders: Folder[];

  @OneToMany(() => File, (file) => file.folder)
  @ApiProperty({ type: () => [File], description: 'List of files inside this folder' })
  files: File[];
}
