import { Controller, Post, Get, Body, Query, Delete, HttpCode, Param, NotFoundException, HttpStatus, Put } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiQuery, ApiBody } from '@nestjs/swagger';
import { FolderService } from './folder.service';
import { Folder } from './entities/folder.entity';

@ApiTags('Folders') // Groups APIs under "Folders" in Swagger UI
@Controller('folders')
export class FolderController {
  constructor(private readonly folderService: FolderService) {}

  @Post('create')
  @ApiOperation({ summary: 'Create a new folder' })
  @ApiResponse({ status: 201, description: 'Folder created successfully' })
  @ApiResponse({ status: 400, description: 'Invalid input data' })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        name: { type: 'string', example: 'Documents' },
        description: { type: 'string', example: 'important' },
        parentFolderId: { type: 'number', nullable: true, example: 1 },
      },
    },
  })
  async createFolder(@Body() body: { name: string; description:string;parentFolderId?: number }) {
    return await this.folderService.createFolder(body.name, body.description,body.parentFolderId);
  }

  @Get()
  @ApiOperation({ summary: 'Get paginated list of folders' })
  @ApiResponse({ status: 200, description: 'Returns paginated folders' })
  @ApiQuery({ name: 'parentFolderId', required: false, type: 'number', example: 1 })
  @ApiQuery({ name: 'page', required: false, type: 'number', example: 1 })
  @ApiQuery({ name: 'limit', required: false, type: 'number', example: 10 })
  async getFoldersPaginated(
    @Query('parentFolderId') parentFolderId?: number,
    @Query('page') page = 1,
    @Query('limit') limit = 10,
  ) {
    return await this.folderService.getFoldersPaginated(parentFolderId, Number(page), Number(limit));
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete a folder by ID' })
  @ApiResponse({ status: HttpStatus.NO_CONTENT, description: 'Folder deleted successfully' })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'Folder not found' })
  async deleteFolder(@Param('id') id: number): Promise<void> {
    try {
      await this.folderService.deleteFolder(id);
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw new NotFoundException(error.message);
      }
      throw error;
    }
  }

  
 
  
    @Put(':id')
    @HttpCode(HttpStatus.OK)
    @ApiOperation({ summary: 'Update a folder by ID' })
    @ApiResponse({ status: HttpStatus.OK, description: 'Folder updated successfully' })
    @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'Folder not found' })
    @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: 'Invalid input' })
    async updateFolder(
      @Param('id') id: number,
      @Body() updateFolderDto: { name: string; description:string},
    ): Promise<void> {
      try {
        await this.folderService.updateFolder(id, updateFolderDto);
      } catch (error) {
        if (error instanceof NotFoundException) {
          throw new NotFoundException(error.message);
        }
        throw error;
      }
    }

  

  // Filtered GET request to fetch folders with specific filters
  @Get('filtered')
  @ApiOperation({ summary: 'Get filtered folders' })
  @ApiResponse({ status: 200, description: 'Successfully fetched filtered folders', type: [Folder] })
  async getFilteredFolders(
    @Query('name') name?: string,
    @Query('description') description?: string,
    @Query('createdDate') createdDate?: string,
  ): Promise<Folder[]> {
    return this.folderService.findFolders({ name, description, createdDate });
  }
}

  

