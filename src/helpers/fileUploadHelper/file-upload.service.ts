import { FileSystemStoredFile } from 'nestjs-form-data';
import * as randomstring from 'randomstring';
import { join } from 'path';
import * as fs from 'fs/promises';
import { Injectable } from '@nestjs/common';

@Injectable()
export class FileUploadHelper {
    async modelFileUpdate(model: any, table: string, column: string, uploadedFile: FileSystemStoredFile | null, visibility: string = 'storage'): Promise<string | null> {
        if (!uploadedFile) {
            return model[column];
        }

        const baseDirectory = `${visibility}/${table.replace('_', '-')}/${column.replace('_', '-')}`;

        if (model[column] !== null) {
            const existingFilePath = join(baseDirectory, model[column]);

            if (await fs.access(existingFilePath).then(() => true).catch(() => false)) {
                await fs.unlink(existingFilePath);
            }
        }

        const fileName = `${column.replace('_', '-')}-${randomstring.generate(10)}.${uploadedFile.originalName.split('.').pop()}`;

        const newFilePath = join(baseDirectory, fileName);
        await fs.mkdir(baseDirectory, { recursive: true })
        await fs.copyFile(uploadedFile.path, newFilePath);

        return fileName;
    }

    async modelFileStore(table: string, column: string, uploadedFile: FileSystemStoredFile | null, visibility: string = 'storage'): Promise<string | null> {
        if (!uploadedFile) {
            return null;
        }

        const baseDirectory = `${visibility}/${table.replace('_', '-')}/${column.replace('_', '-')}`;

        const fileName = `${column.replace('_', '-')}-${randomstring.generate(10)}.${uploadedFile.originalName.split('.').pop()}`;

        const newFilePath = join(baseDirectory, fileName);
        await fs.copyFile(uploadedFile.path, newFilePath);

        return fileName;
    }

    async modelFileDelete(model: any, table: string, column: string, visibility: string = 'storage'): Promise<void> {
        const FilePath = `${visibility}/${table.replace('_', '-')}/${column.replace('_', '-')}/${model[column]}`;

        if (await fs.access(FilePath).then(() => true).catch(() => false)) {
            await fs.unlink(FilePath);
        }
    }
}
