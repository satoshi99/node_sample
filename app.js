const express = require('express');
const mysql = require('mysql');
const app = express();
const connection = mysql.createConnection({
  host: 'localhost',
  user: 'satoshi',
  password: 'satoshisql',
  database: 'listapp'
})

connection.connect((err) => {
  if (err) {
    console.log('error connecting: ' + err.stack);
    return;
  }
  console.log('success');
});

app.use(express.static('public'));
app.use(express.urlencoded({extended: false}));

app.get('/', (req, res) => {
  res.render('top.ejs');
});

app.get('/index', (req, res) => {
  connection.query(
    'SELECT * FROM runlist',
    (error, results) => {
      res.render('index.ejs', {items: results});
    }
  );
});

app.get('/new', (req, res) => {
  res.render('new.ejs');
});

app.post('/create', (req, res) => {
  connection.query(
    'insert into runlist (content) values (?)',
    [ req.body.itemName ],
    (error, results) => {
      res.redirect('/index')
    }
  );
});

app.post('/delete/:id', (req, res) => {
  connection.query(
    'delete from runlist where id=?',
    [ req.params.id ],
    (error, results) => {
      res.redirect('/index');
    }
  );
});

app.get('/edit/:id', (req, res) => {
  connection.query(
    'select * from runlist where id = ?',
    [ req.params.id ],
    (error, results) => {
      res.render('edit.ejs', {item: results[0]});
    }
  );
});

app.post('/update/:id', (req, res) => {
  connection.query(
    'update runlist set content = ? where id = ?',
    [ req.body.itemName, req.params.id ],
    (error, results) => {
      res.redirect('/index');
    }
  );
});

app.listen(3000);
