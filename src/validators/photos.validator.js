import Joi from '@hapi/joi';

export const GetListPhotosSchema = Joi.object({
  skip: Joi
    .number()
    .integer()
    .greater(-1)
    .default(0),
  limit: Joi
    .number()
    .integer()
    .greater(-1)
    .default(10),
});

export const UploadPhotosSchema = Joi.object({
  album: Joi
    .string()
    .pattern(/^[A-Za-z]+$/, { name: 'album partern'})
    .min(2)
    .max(50)
});

export const DeletePhotosSchema = Joi.object({
  album: Joi
    .string()
    .pattern(/^[A-Za-z]+$/, { name: 'album partern'})
    .min(2)
    .max(50),
  filename: Joi.string(),
});