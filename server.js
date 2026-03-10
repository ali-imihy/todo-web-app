const express = require('express');
const mysql = require('mysql2');
const path = require('path');
const bodyParser = require('body-parser');
const app = express();
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static(path.join(__dirname, 'static')));
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');
const port = 3000;



const base = mysql.createConnection({
  host: 'localhost',     // connect to database
  user: 'your_username',
  password: 'your_password',
  database: 'todo_app'
});

base.connect(function(err) {    // connect
  if (err) {
    throw err;
  }
  console.log("Connected");
});



app.get('/', (req, res) => {      // home page, get table
  base.query('SELECT * FROM todolist', (err, result) => {
    if (err) {
      return res.send(err);
    }
    res.render('home', {todos: result, filter: null})   // send result and no filter
  });
});



app.post('/add', (req, res) => {    // sending a add request
  const { title } = req.body; // get title of task
  if (!title) {
    return res.redirect('/');
  }
  if (title.trim() === '') {      // if whitespace then dont add
    return res.redirect('/');
  }
  base.query('INSERT INTO todolist (action, progress) VALUES (?, ?)', [title.trim(), 'in progress'], (err) => {
      if (err) {
        res.render('error');      // add the action along with defaulting to in progress
      } else {
        res.redirect('/');  // reload page
      }
    }
  );
});

app.post('/delete/:id', (req, res) => {   // sending a delete request
  const id = req.params.id;
  base.query('DELETE FROM todolist WHERE id = ?', [id], (err) => {    // delete id
    if (err) {
      res.render('error');
    } else {
      res.redirect('/');    // reload page
    }
  });
});

app.get('/filter/:status', (req, res) => {    // filtering either in progress or finished
  const filter = req.params.status;
  base.query('SELECT * FROM todolist WHERE progress = ?', [filter], (err, result) => {
    if (err) {
      res.render('error');      
    } else {
      res.render('home', { todos: result, filter });  // send filter for pug to know which to display
    }
  });
});

app.post('/update/:id', (req, res) => {   // update progress
  const id = req.params.id;
  const { progress } = req.body;
  base.query('UPDATE todolist SET progress = ? WHERE id = ?', [progress, id], (err) => {  // send progress and id
    if (err) {
      res.status(500).json({ success: false, error: err.message });
    } else {
      res.json({ success: true });    // return true 
    }
  });
});


app.listen(port, () => {
  console.log(`Server listening at http://localhost:3000`);
});
