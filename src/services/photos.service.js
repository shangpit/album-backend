import fs from 'fs';
import path from 'path';
import { BaseService } from './base.service';

class PhotosService extends BaseService {
  getFilesFromDir = (dir, fileTypes = []) => {
    let filesToReturn = [];
    let currentDir = ''
    const walkDir = (currentPath) => {
      const files = fs.readdirSync(currentPath);
      for (let i in files) {
        const currentFilePath = path.join(currentPath, files[i]);
        if (
          fs.statSync(currentFilePath).isFile() &&
          fileTypes.includes(path.extname(currentFilePath).slice(1).toLowerCase()))
        {
          const { ino, dev } = fs.statSync(currentFilePath);
          filesToReturn.push(Object.assign(this.parseResponseObject(currentDir, files[i]), { id: `${ino}-${dev}` }));
        } else if (fs.statSync(currentFilePath).isDirectory()) {
          currentDir = files[i];
          walkDir(currentFilePath);
        }
      }
    };
    walkDir(dir);
    return filesToReturn;
  };

  checkAndMoveFile = (album, file) => new Promise((_res, _rej) => {
    const { path: originalPath, name } = file;
    var source = fs.createReadStream(originalPath);
    var dest = fs.createWriteStream(`${process.env.BASE_DIR}/${album}/${name}`);
    
    source.pipe(dest);
    source.on('end', () => {
      fs.unlinkSync(originalPath);
      _res(this.parseResponseObject(album, name));
    });
    source.on('error', (err) => {
      _rej(err);
    });
  });

  parseResponseObject = (album, name) => {
    return {
      album: this.capitalize(album),
      name,
      path: `/albums/${album}/${name}`,
      raw: `${process.env.BASE_STATIC_HOST}/${album}/${name}`
    }
  };

  capitalize = (s) => {
    if (typeof s !== 'string') return '';
    return s.charAt(0).toUpperCase() + s.slice(1);
  }

  deleteOnePhoto = (album, photo) => {
    return new Promise((res, rej) => {
      if (!fs.existsSync(`${process.env.BASE_DIR}/${album}/${photo}`)) {
        res(null);
      }

      fs.unlink(`${process.env.BASE_DIR}/${album}/${photo}`, (err) => {
        if (!err) {
          res('OK');
        }
        rej(err);
      });
    });
  };
}

export default new PhotosService();