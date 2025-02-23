export class CreateFileDto {
    fileName: string;
    filePath: string;
    fileType: string;
    size: number;
    folderId: number;  // The ID of the folder the file belongs to
  }
  