import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Folder } from './entities/folder.entity';

@Injectable()
export class FolderService {
  constructor(
    @InjectRepository(Folder)
    private readonly folderRepository: Repository<Folder>,
  ) {}

  async createFolder(name: string, description:string,parentFolderId?: number): Promise<Folder> {
    const folder = new Folder();
    folder.name = name;
    folder.description =description;
    
    if (parentFolderId) {
      const parentFolder = await this.folderRepository.findOne({ where: { id: parentFolderId } });
      if (!parentFolder) throw new Error('Parent folder not found');
      folder.parentFolder = parentFolder;
    }

    return await this.folderRepository.save(folder);
  }


  async getFoldersPaginated(parentFolderId?: number, page = 1, limit = 10) {
    const query = this.folderRepository.createQueryBuilder('folder')
      .leftJoinAndSelect('folder.subFolders', 'subFolders')
      .leftJoinAndSelect('folder.files', 'files');
  
    if (parentFolderId) {
      query.where('folder.parentFolderId = :parentFolderId', { parentFolderId });
    }
  
    const [folders, total] = await query
      .skip((page - 1) * limit)
      .take(limit)
      .getManyAndCount();
  
  
    return { folders: folders, total };
  }
  
 

  
  async updateFolder(id: number, updateFolderDto: {name:string}): Promise<void> {
    const folder = await this.folderRepository.findOne({ where: { id } });

    if (!folder) {
      throw new NotFoundException(`Folder with ID ${id} not found`);
    }

    // Update the folder with the new data
    await this.folderRepository.update(id, updateFolderDto);
  }



  async deleteFolder(id: number): Promise<void> {
    const folder = await this.folderRepository.findOne({
      where: { id },
      relations: ['subFolders'], // Load subfolders
    });

    if (!folder) {
      throw new NotFoundException(`Folder with ID ${id} not found`);
    }

    // Recursively delete subfolders
    if (folder.subFolders && folder.subFolders.length > 0) {
      for (const subFolder of folder.subFolders) {
        await this.deleteFolder(subFolder.id); // Recursive call
      }
    }

    // Delete the folder itself
    await this.folderRepository.delete(id);
  }

    async findFolders(filters: {
      name?: string;
      description?: string;
      createdDate?: string;
    }): Promise<Folder[]> {
      const queryBuilder = this.folderRepository.createQueryBuilder('folder');
  
      if (filters.name) {
        queryBuilder.andWhere('folder.name LIKE :name', { name: `%${filters.name}%` });
      }
  
      if (filters.description) {
        queryBuilder.andWhere('folder.description LIKE :description', { description: `%${filters.description}%` });
      }
  
      if (filters.createdDate) {
        const parsedDate = new Date(filters.createdDate);
        if (!isNaN(parsedDate.getTime())) {
          queryBuilder.andWhere('folder.createdAt >= :createdDate', { createdDate: parsedDate });
        }
      }
  
      return queryBuilder.getMany();
    }
  }



