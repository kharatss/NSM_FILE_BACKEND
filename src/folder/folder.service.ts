import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Folder } from './entities/folder.entity';
interface TransformedFolder {
  id: number;
  name: string;
  description:string;
  createdAt: Date;
  updatedAt: Date;
  children: any[]; // Children can be folders or files
  type:'file'|'folder'
}

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

  // async getFoldersPaginated(parentFolderId?: number, page = 1, limit = 10) {
  //   const query = this.folderRepository.createQueryBuilder('folder')
  //     .leftJoinAndSelect('folder.subFolders', 'subFolders')
  //     .leftJoinAndSelect('folder.files', 'files');

  //   if (parentFolderId) query.where('folder.parentFolderId = :parentFolderId', { parentFolderId });
  //   query.addSelect(['files.created_at', 'files.updated_at']);
  //   const [folders, total] = await query
  //     .skip((page - 1) * limit)
  //     .take(limit)
  //     .getManyAndCount();

  //   return { folders, total };
  // }
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
  
    // Transform the folders into a nested structure
    const transformedFolders = this.transformFolders(folders);
  
    return { folders: transformedFolders, total };
  }
  
  // Helper function to transform folders into a nested structure
  private transformFolders(folders: Folder[]): TransformedFolder[] {
    const folderMap: Record<number, TransformedFolder> = {};
  
    // Step 1: Create a map of all folders
    folders.forEach((folder) => {
      folderMap[folder.id] = {
        id: folder.id,
        name: folder.name,
        description:folder.description,
        createdAt: folder.createdAt,
        updatedAt: folder.updatedAt,
        type:'folder',
        children: [],
      };
    });
  
    // Step 2: Build the nested structure
    const rootFolders: TransformedFolder[] = [];
  
    folders.forEach((folder) => {
      const transformedFolder = folderMap[folder.id];
  
      // Add subFolders as children
      folder.subFolders.forEach((subFolder) => {
        const transformedSubFolder = folderMap[subFolder.id];
        if (transformedSubFolder) {
          transformedFolder.children.push(transformedSubFolder);
        }
      });
  
      // Add files as children
      folder.files.forEach((file) => {
        transformedFolder.children.push(file);
      });
  
      // If the folder has no parent, it's a root folder
      if (!folders.some((f) => f.subFolders.some((sf) => sf.id === folder.id))) {
        rootFolders.push(transformedFolder);
      }
    });
  
    return rootFolders;
  }
}
