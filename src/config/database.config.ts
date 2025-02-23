import { TypeOrmModuleOptions } from '@nestjs/typeorm';

import * as dotenv from 'dotenv';
import { Folder } from '../folder/entities/folder.entity';
import { File } from '../file/entities/file.entity';

dotenv.config();

export const databaseConfig: TypeOrmModuleOptions = {
  type: 'mssql',
  host: process.env.DB_HOST || 'DESKTOP-64N7LI8',
  port: Number(process.env.DB_PORT) || 1433,
  username: process.env.DB_USER || 'admin', // SQL Server username
  password: process.env.DB_PASSWORD || 'admin', // SQL Server password
  database: process.env.DB_NAME || 'NMS_FILE',
  entities: [Folder, File],
  synchronize: false, 
  options: {
    encrypt: false, 
    trustServerCertificate: true, 
  },
};