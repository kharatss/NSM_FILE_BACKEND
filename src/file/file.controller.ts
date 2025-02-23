import { Controller, Post, Get, Body, Query, UseInterceptors, UploadedFile } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiQuery, ApiBody, ApiConsumes } from '@nestjs/swagger';
import { FileService } from './file.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';

@ApiTags('Files') // Groups APIs under "Files" in Swagger UI
@Controller('files')
export class FileController {
  constructor(private readonly fileService: FileService) {}

  @Post('upload')
  @ApiOperation({ summary: 'Upload a file' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        file: { type: 'string', format: 'binary' },
        description:{type:'string',example:"importance"},
        folderId: { type: 'number', description: 'Folder ID where the file should be stored' },
      },
    },
  })
  @ApiResponse({ status: 201, description: 'File successfully uploaded' })
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: './uploads',
        filename: (req, file, cb) => {
          const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
          cb(null, file.fieldname + '-' + uniqueSuffix + extname(file.originalname));
        },
      }),
    }),
  )
  async uploadFile(
    @UploadedFile() file: Express.Multer.File, 
    @Body() body: { folderId: number, description: string }
  ) {
    const { folderId, description } = body;
    return await this.fileService.uploadFile(file, folderId, description);
  }

  @Get()
  @ApiOperation({ summary: 'Get paginated list of files' })
  @ApiResponse({ status: 200, description: 'Returns paginated files' })
  @ApiQuery({ name: 'folderId', required: true, type: 'number', example: 1 })
  @ApiQuery({ name: 'page', required: false, type: 'number', example: 1 })
  @ApiQuery({ name: 'limit', required: false, type: 'number', example: 10 })
  async getFilesPaginated(
    @Query('folderId') folderId: number,
    @Query('page') page = 1,
    @Query('limit') limit = 10,
  ) {
    return await this.fileService.getFilesPaginated(Number(folderId), Number(page), Number(limit));
  }
}
