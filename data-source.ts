import { DataSource } from 'typeorm';
import * as dotenv from 'dotenv';
import { File } from './src/file/entities/file.entity';
import { Folder } from './src/folder/entities/folder.entity';

dotenv.config();

export const AppDataSource = new DataSource({
  type: 'mssql',
  host: process.env.DB_HOST || 'DESKTOP-64N7LI8',
  port: Number(process.env.DB_PORT) || 1433,
  username: process.env.DB_USER || 'admin',
  password: process.env.DB_PASSWORD || 'admin',
  database: process.env.DB_NAME || 'NMS_FILE',
  entities: [Folder, File],
  migrations: ['src/migrations/*.ts'], // Ensure you have a migrations folder
  synchronize: false, // Use migrations instead of sync
  logging: true, // Enable logging for debugging
  options: {
    encrypt: false,
    trustServerCertificate: true,
  },
});
