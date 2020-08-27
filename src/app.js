import env from 'dotenv';
env.config();
import express from 'express';
import helmet from 'helmet';
import cors from 'cors';
import bodyParser from 'body-parser';
import router from './router';

const app = express();
if (process.env.NODE_ENV === 'production') {
  app.use(helmet());
}
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use('/photos', express.static('albums'));
app.use(`/`, router);

module.exports = app;
