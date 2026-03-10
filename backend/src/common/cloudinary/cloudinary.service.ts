import { Injectable } from '@nestjs/common';
import {
  v2 as cloudinary,
  UploadApiErrorResponse,
  UploadApiResponse,
} from 'cloudinary';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import type { Multer } from 'multer';

export type CloudinaryFolder = 'foods' | 'category' | 'users';

@Injectable()
export class CloudinaryService {
  async uploadImage(
    file: Express.Multer.File,
    folder: CloudinaryFolder,
    publicId?: string,
  ): Promise<UploadApiResponse> {
    return new Promise((resolve, reject) => {
      const options: Record<string, unknown> = {
        folder: `Mealio/${folder}`,
        overwrite: true,
      };
      if (publicId) {
        options.public_id = publicId;
      }
      cloudinary.uploader
        .upload_stream(
          options,
          (
            error: UploadApiErrorResponse | undefined,
            result: UploadApiResponse | undefined,
          ) => {
            if (error || !result)
              return reject(new Error(error?.message ?? 'Upload failed'));
            resolve(result);
          },
        )
        .end(file.buffer);
    });
  }

  async deleteImage(publicId: string) {
    return cloudinary.uploader.destroy(publicId) as Promise<{
      result: string;
    }>;
  }
}
