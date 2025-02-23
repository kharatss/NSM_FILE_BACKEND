// import { MigrationInterface, QueryRunner } from "typeorm";

// export class NewMigration1740156856431 implements MigrationInterface {
//     name = 'NewMigration1740156856431'

//     public async up(queryRunner: QueryRunner): Promise<void> {
//         await queryRunner.query(`CREATE TABLE "folder" ("created_at" datetime2 NOT NULL CONSTRAINT "DF_a491529e456af91f5a3272e22fe" DEFAULT GETDATE(), "updated_at" datetime2 NOT NULL CONSTRAINT "DF_2f6cee6b31c75cf4c35b9e56018" DEFAULT GETDATE(), "id" int NOT NULL IDENTITY(1,1), "name" nvarchar(255) NOT NULL, "parentFolderId" int, CONSTRAINT "PK_6278a41a706740c94c02e288df8" PRIMARY KEY ("id"))`);
//         await queryRunner.query(`CREATE TABLE "file" ("id" int NOT NULL IDENTITY(1,1), "name" nvarchar(255) NOT NULL, "fileType" nvarchar(255) NOT NULL, "filePath" nvarchar(255) NOT NULL, "folderId" int, CONSTRAINT "PK_36b46d232307066b3a2c9ea3a1d" PRIMARY KEY ("id"))`);
//         await queryRunner.query(`ALTER TABLE "folder" ADD CONSTRAINT "FK_804ea52f6729e3940498bd54d78" FOREIGN KEY ("parentFolderId") REFERENCES "folder"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
//         await queryRunner.query(`ALTER TABLE "file" ADD CONSTRAINT "FK_3563fb0d3e9557359f541ac77da" FOREIGN KEY ("folderId") REFERENCES "folder"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
//     }

//     public async down(queryRunner: QueryRunner): Promise<void> {
//         await queryRunner.query(`ALTER TABLE "file" DROP CONSTRAINT "FK_3563fb0d3e9557359f541ac77da"`);
//         await queryRunner.query(`ALTER TABLE "folder" DROP CONSTRAINT "FK_804ea52f6729e3940498bd54d78"`);
//         await queryRunner.query(`DROP TABLE "file"`);
//         await queryRunner.query(`DROP TABLE "folder"`);
//     }

// }
import { MigrationInterface, QueryRunner } from "typeorm";

export class NewMigration1740156856431 implements MigrationInterface {
    name = 'NewMigration1740156856431'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "folder" ("created_at" datetime2 NOT NULL CONSTRAINT "DF_a491529e456af91f5a3272e22fe" DEFAULT GETDATE(), "updated_at" datetime2 NOT NULL CONSTRAINT "DF_2f6cee6b31c75cf4c35b9e56018" DEFAULT GETDATE(), "id" int NOT NULL IDENTITY(1,1), "name" nvarchar(255) NOT NULL, "parentFolderId" int, CONSTRAINT "PK_6278a41a706740c94c02e288df8" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "file" ("created_at" datetime2 NOT NULL CONSTRAINT "DF_a491529e456af91f5a3272e22ef" DEFAULT GETDATE(),"updated_at" datetime2 NOT NULL CONSTRAINT "DF_2f6cee6b31c75cf4c35b9e56017" DEFAULT GETDATE(),"id" int NOT NULL IDENTITY(1,1), "name" nvarchar(255) NOT NULL, "fileType" nvarchar(255) NOT NULL, "filePath" nvarchar(255) NOT NULL, "folderId" int, CONSTRAINT "PK_36b46d232307066b3a2c9ea3a1d" PRIMARY KEY ("id"))`);
        
        // Remove ON DELETE CASCADE for the self-referencing foreign key
        await queryRunner.query(`ALTER TABLE "folder" ADD CONSTRAINT "FK_804ea52f6729e3940498bd54d78" FOREIGN KEY ("parentFolderId") REFERENCES "folder"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        
        await queryRunner.query(`ALTER TABLE "file" ADD CONSTRAINT "FK_3563fb0d3e9557359f541ac77da" FOREIGN KEY ("folderId") REFERENCES "folder"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "file" DROP CONSTRAINT "FK_3563fb0d3e9557359f541ac77da"`);
        await queryRunner.query(`ALTER TABLE "folder" DROP CONSTRAINT "FK_804ea52f6729e3940498bd54d78"`);
        await queryRunner.query(`DROP TABLE "file"`);
        await queryRunner.query(`DROP TABLE "folder"`);
    }
}