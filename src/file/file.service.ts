import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { File } from './entities/file.entity';
import { Folder } from '../folder/entities/folder.entity';
import * as fs from 'fs';
import * as path from 'path';

@Injectable()
export class FileService {
  constructor(
    @InjectRepository(File)
    private readonly fileRepository: Repository<File>,
    @InjectRepository(Folder)
    private readonly folderRepository: Repository<Folder>,
  ) {}

  // async uploadFile(name: string, fileType: string, filePath: string, folderId: number): Promise<File> {
  //   const folder = await this.folderRepository.findOne({ where: { id: folderId } });
  //   if (!folder) throw new Error('Folder not found');

  //   const file = new File();
  //   file.name = name;
  //   file.fileType = fileType;
  //   file.filePath = filePath;
  //   file.folder = folder;

  //   return await this.fileRepository.save(file);
  // }

  private uploadDir = path.join(__dirname, '../../uploads');

  async uploadFile(file: Express.Multer.File, folderId: number,description:string) {
    if (!fs.existsSync(this.uploadDir)) {
      fs.mkdirSync(this.uploadDir, { recursive: true });
    }

    const folder = await this.folderRepository.findOne({ where: { id: folderId } });
    if (!folder) {
      throw new NotFoundException('Folder not found');
    }

    const newFile = this.fileRepository.create({
      name: file.originalname,
      fileType: file.mimetype,
      filePath: file.path,
      description: description,
      folder: folder,
    });

    return await this.fileRepository.save(newFile);
  }

  async getFilesPaginated(folderId: number, page = 1, limit = 10) {
    const [files, total] = await this.fileRepository.findAndCount({
      where: { folder: { id: folderId } },
      skip: (page - 1) * limit,
      take: limit,
    });

    return { files, total };
  }
}
