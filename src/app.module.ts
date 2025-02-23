import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FileController } from './file/file.controller';
import { Folder } from './folder/entities/folder.entity';
import { File } from './file/entities/file.entity';

import { FolderController } from './folder/folder.controller';
import { FolderService } from './folder/folder.service';
import { FileService } from './file/file.service';
import { databaseConfig } from './config/database.config';

@Module({
  imports: [
    TypeOrmModule.forRoot(databaseConfig),
    TypeOrmModule.forFeature([Folder, File]),
  ],
  controllers: [FolderController, FileController],
  providers: [FolderService, FileService],
})
export class AppModule {}
