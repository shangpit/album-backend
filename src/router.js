import { Router } from 'express';
import { HEALTH_CHECK, PHOTOS } from './constants/endpoint.constant';
import PhotosController from './controllers/photos.controller';

const router = Router();

router.get(`/${HEALTH_CHECK}`, (req, res) => {
  res.status(200).json({
    message: 'OK',
  });
});

router.post(`/${PHOTOS}/list`, PhotosController.getList);
router.put(`/${PHOTOS}`, PhotosController.uploadPhotos);
router.delete(`/${PHOTOS}/:album/:filename`, PhotosController.deletePhoto);
router.delete(`/${PHOTOS}`, PhotosController.deletePhotos);

export default router;
