// import bodyParser from 'body-parser';
import User from './models/user'; //講義沒寫自己引入，不然會報錯
import ScoreCard from './models/ScoreCard';
import cors from 'cors';
import db from './db';
import express from 'express';
import dotenv from "dotenv-defaults";
import routes from './routes';

const app = express();
app.use(cors());
// // Parses the text as JSON and exposes the resulting // object on req.body.
// app.use(bodyParser.json());
app.use(express.json());
dotenv.config();
app.use('/', routes);

const port = process.env.PORT || 4000;
app.listen(port, () => {
    console.log(`Server is up on port ${port}.`)
})



// todo
app.delete('/cards', (req, res) => {
    res.send('Received a DELETE HTTP method');
});



db.connect();


