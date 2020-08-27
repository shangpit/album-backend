import fs from 'fs';
import formidable from 'formidable';
import { GetListPhotosSchema, UploadPhotosSchema, DeletePhotosSchema } from '../validators/photos.validator';
import ExceptionHelper from '../helpers/exception.helper';
import { FILE_TYPES } from '../constants/filetype-supported.constant';
import PhotosService from '../services/photos.service';

class PhotosController {
  uploadPhotos = async (_req, _res) => {
    const form = formidable({ multiples: true });
    form.parse(_req, async (err, fields, files) => {
      if (err) {
        return ExceptionHelper.badRequest(_res);
      }

      const { error: errValidateField, value: { album } } = UploadPhotosSchema.validate(fields);
      if (errValidateField) {
        const { message } = errValidateField.details[0];
        return ExceptionHelper.badRequest(_res, message);
      }

      if (!fs.existsSync(`${process.env.BASE_DIR}/${album}`)) {
        fs.mkdirSync(`${process.env.BASE_DIR}/${album}`);
      }

      let photos = [];

      if (files.documents.length === undefined) {
        photos = [files.documents];
      } else {
        photos = files.documents;
      }

      photos = photos.filter(item => item.type.includes('image'));;
      const totalSizeInMegabyte = photos.reduce((prev, curr) => prev + curr.size, 0) / (1024 * 1024);
      
      if (totalSizeInMegabyte > process.env.MAX_UPLOAD_SIZE) {
        return ExceptionHelper.badRequest(_res, 'Over limit size of total file!');
      }

      const data = await Promise.all(photos.map(async photo => await PhotosService.checkAndMoveFile(album, photo)));
      _res.status(200).json({
        message: 'OK',
        data,
      })
    });
  };

  getList = (_req, _res) => {
    const { error, value } = GetListPhotosSchema.validate(_req.body);
    if (error) {
      const { message } = error.details[0];
      return ExceptionHelper.badRequest(_res, message);
    }

    const { skip, limit } = value;

    const allFiles = PhotosService.getFilesFromDir(process.env.BASE_DIR, FILE_TYPES);
    const documents = allFiles.slice(skip, skip + limit);

    _res.status(200).json({
      message: 'OK',
      documents
    })
  }

  deletePhoto = (_req, _res) => {
    const { error, value: { album, filename } } = DeletePhotosSchema.validate(_req.params);
    if (error) {
      const { message } = error.details[0]
      return ExceptionHelper.badRequest(_res, message);
    }

    const filePath = `${process.env.BASE_DIR}/${album.toLowerCase()}/${filename}`;
    if (!fs.existsSync(filePath)) {
      return ExceptionHelper.notFound(_res, 'Photo not found');
    }

    fs.unlink(filePath, (err) => {
      if (err) {
        return ExceptionHelper.internalServerError(_res);
      }
      return _res.status(200).json({
        message: 'OK',
      })
    });
  };

  deletePhotos = async (_req, _res) => {
    const arrayOfAlbums = _req.body;
    let array = [];
    for (let i in arrayOfAlbums) {
      const arrayOfPhotos = arrayOfAlbums[i].documents.split(',').map(item => item.trim());
      for (let j in arrayOfPhotos) {
        array.push({
          album: arrayOfAlbums[i].album,
          photo: arrayOfPhotos[j],
        })
      }
    }

    const results = await Promise.all(array.map(item => {
      return PhotosService.deleteOnePhoto(item.album, item.photo);
    }));
    
    const validResults = results.filter(result => result === 'OK');

    _res.status(200).json({
      message: 'OK',
      documentDeleted: validResults.length,
    })
  };

  
}

export default new PhotosController();