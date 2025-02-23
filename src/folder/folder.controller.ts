import { Controller, Post, Get, Body, Query } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiQuery, ApiBody } from '@nestjs/swagger';
import { FolderService } from './folder.service';

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
}
