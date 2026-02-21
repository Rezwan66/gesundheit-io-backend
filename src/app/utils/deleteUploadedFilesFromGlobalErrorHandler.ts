/* eslint-disable @typescript-eslint/no-explicit-any */
import { Request } from 'express';
import { deleteFileFromCloudinary } from '../config/cloudinary.config';

export const deleteUploadedFilesFromGlobalErrorHandler = async (req: Request) => {
  try {
    const filesToDelete: string[] = [];
    // Case 1: For single file deletion
    if (req.file && req.file?.path) {
      filesToDelete.push(req.file.path);
    }
    // Case 2: When req.files is an object of arrays, and we need to delete files from different fields
    else if (req.files && typeof req.files === 'object' && !Array.isArray(req.files)) {
      // [[{ path: 'rfrf' }], [{ report1 }, { report2 }], []]
      Object.values(req.files).forEach(fileArray => {
        if (Array.isArray(fileArray)) {
          fileArray.forEach(file => {
            if (file?.path) {
              filesToDelete.push(file.path);
            }
          });
        }
      });
    }
    // Case 3: When req.files is an array, and we need to delete files from the same field
    else if (req.files && Array.isArray(req.files) && req.files.length > 0) {
      req.files.forEach(file => {
        if (file?.path) {
          filesToDelete.push(file.path);
        }
      });
    }

    if (filesToDelete.length > 0) {
      await Promise.all(filesToDelete.map(url => deleteFileFromCloudinary(url)));
      console.log(
        `Deleted ${filesToDelete.length} uploaded file(s) from cloudinary due to an error during request processing.\n`,
      );
      //   console.log(`\nFiles ${filesToDelete.join(', ')} deleted from cloudinary`);
    }
  } catch (error: any) {
    console.error('Error deleting uploaded files from Global Error Handler', error);
  }
};
