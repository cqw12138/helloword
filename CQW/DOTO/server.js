var express  = require('express');
var app      = express();
var mongoose = require('mongoose');

// mongoose.connect('mongodb://node:node@mongo.onmodulus.net:27017/uwO3mypu');
var MongoClient = require('mongodb').MongoClient;
MongoClient.connect("mongodb://localhost:27017/admin", {
  db: {w: 1, native_parser: false},
  server: {
    poolSize: 5,
    socketOptions: {connectTimeoutMS: 500},
    auto_reconnect: true
  },
  replSet: {},
  mongos:{}
}, function(err, db) {
  if (err) {
    console.log("Connection failed via connection string.....");
  } else {
    var adminDB = db.admin();
    adminDB.listDatabases(function(err, databases){
      console.log("before add databases list:");
      console.log(databases);
    });
    console.log("connection via connection string......");
    // db.logout(function(err, result) {
    //   if (!err) {
    //     console.log("logged out via connection string.......");
    //   }
    //   db.close();
    //   console.log("connection closed......");
    // });
  }
});

app.configure(function() {
    // set the static files location /public/img will be /img for users
    app.use(express.static(__dirname + '/public'));
    // log every request to the console
    app.use(express.logger('dev'));
    // pull information from html in POST
    // app.use(express.bodyParser());
    app.use(express.urlencoded());
    app.use(express.json());
    console.log('yes congig....');
});

// ----- define model
var Todo = mongoose.model('Todo', {
    text : String
});

// ----- define routes
// get all todos
app.get('/api/todos', function(req, res) {
    // use mongoose to get all todos in the database
    Todo.find(function(err, todos) {
        // if there is an error retrieving, send the error. nothing after res.send(err) will execute
        if (err) {
            res.send(err);
        }
        res.json(todos); // return all todos in JSON format
        console.log("get all todos.....");
    });
});

// create Todo and send back all todos after creation
app.post('/api/todos', function(req, res) {
    // create a Todo, information comes from AJAX request from Angular
    Todo.create({
        text : req.body.text,
        done : false
    }, function(err, todo) {
        if (err) {
            res.send(err);
        }
        // get and return all the todos after you create another
        Todo.find(function(err, todos) {
            if (err) {
                res.send(err);
            }
            res.json(todos);
        });
        console.log("create true .......");
    });

});

// delete a todo
app.delete('/api/todos/:todo_id', function(req, res) {
    Todo.remove({
        _id : req.params.todo_id
    }, function(err, todo) {
        if (err)
            res.send(err);
        // get and return all the todos after you create another
        Todo.find(function(err, todos) {
            if (err) {
                res.send(err);
            }
            res.json(todos);
        });
    });
    console.log("delete true.........");
});

// get the index.html
app.get('*', function(req, res) {
    res.sendfile('./public/index.html'); // load the single view file (angular will handle the page changes on the front-end)
    console.log("get index.html");
});

app.listen(9090);
console.log("App listening on port 9090");
