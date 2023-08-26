import express, { Express, Request, Response } from 'express';
import session from 'express-session';
import connectPgSimple from 'connect-pg-simple';
import dotenv from 'dotenv';
import bodyParser from 'body-parser';
import router from './routes/index';
import cors from 'cors'
import deleteUnsafeFiles from './cron';

dotenv.config();

const app: Express = express();
const port = process.env.PORT as string;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use(cors({
  origin: ['*']
}));

const pgStore = connectPgSimple(session)
const cookieSecret = process.env.COOKIE_SECRET as string;

app.use(
  session({
    store: new pgStore,
    secret: cookieSecret,
    resave: false,
    saveUninitialized: false,
  })
);

app.use("/api/v1", router);

app.listen(3000, '0.0.0.0');

deleteUnsafeFiles.start();
export default app