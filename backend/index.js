import express from 'express';
import mysql from 'mysql';
import cors from 'cors';
import bcrypt, { hash } from 'bcrypt';

const saltRounds = 10;
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

  bcrypt.hash(password, saltRounds, (err, hash) => {
    if (err) {
      console.log(err);
    }
    db.query(
      'INSERT INTO users (username, password) VALUES (?,?)',
      [username, hash],
      (err, result) => {
        console.log(err);
      }
    );
  });
});

app.post('/login', (req, res) => {
  const username = req.body.username;
  const password = req.body.password;

  db.query(
    'SELECT * FROM users WHERE username = ?;',
    username,
    (err, result) => {
      if (err) {
        res.send({ err: err });
      }
      if (result.length > 0) {
        //if we found a user we need to check if the password that was inputed coresponds to the password that is in the db (both at an incrypted state)
        bcrypt.compare(password, result[0].password, (error, response) => {
          if (response) {
            res.send(result);
          } else {
            res.send({
              message: 'Wrong credentials provided.',
            });
          }
        });
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
