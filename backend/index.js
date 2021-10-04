import express from 'express';
import mysql from 'mysql';
import cors from 'cors';

const app = express();
const port = parseInt(process.env.PORT, 10) || 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'Epervier85',
  database: 'registerAndLogin',
});

db.connect(function (error) {
  if (!!error) {
    console.log(error);
  } else {
    console.log('Connected');
  }
});

app.post('/signup', (req, res) => {
  const username = req.body.username;
  const password = req.body.password;

  db.query(
    'INSERT INTO users (username, password) VALUES (?,?)',
    [username, password],
    (err, result) => {
      console.log(err);
    }
  );
});

app.post('/login', (req, res) => {
  const username = req.body.username;
  const password = req.body.password;

  db.query(
    'SELECT * FROM users WHERE username = ? AND password = ?',
    [username, password],
    (err, result) => {
      if (err) {
        res.send({ err: err });
      }
      if (result.length > 0) {
        res.send(result);
      } else {
        res.send({
          message: 'No results found for the credentials you provided.',
        });
      }
    }
  );
});

app.listen(port, () => {
  console.log(
    `Application Authentication Backend listening at http://localhost:${port}`
  );
});
