import express, { Express, Request, Response } from 'express';
import session from 'express-session';
import connectPgSimple from 'connect-pg-simple';
import dotenv from 'dotenv';
import bodyParser from 'body-parser';
import { login, signup, logout} from './controllers/auth';
import { checkAuth } from './middleware/checkAuth';

dotenv.config();

const app: Express = express();
const port = process.env.PORT;

/*assuming an express app is declared here*/
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

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

app.post("/login", login);
app.post("/signup", signup);
app.post("/logout", logout);

app.listen(port, () => {
  console.log(`⚡️[server]: Server is running at http://localhost:${port}`);
});


