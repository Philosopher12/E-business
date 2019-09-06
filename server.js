let express = require('express');
let app = express();
let bodyParser = require('body-parser');
//import week5
const mongodb = require('mongodb');
//const {ObjectId} = require('mongodb');
const morgan = require('morgan');



app.use(bodyParser.urlencoded({
    extended: false
}))
app.use(bodyParser.json())


//Setup the view Engine
app.engine('html', require('ejs').renderFile);
app.set('view engine', 'html');
//Setup the static assets directories
app.use(express.static('images'));
app.use(express.static('views'));
app.use(express.static('public'))

//week5
app.use(morgan('common'));

//Configure MongoDB
const MongoClient = mongodb.MongoClient;

// Connection URL
const url = "mongodb://localhost:27017/";
//reference to the database (i.e. collection)
let db;

//let db = [];

//Connect to mongoDB server
MongoClient.connect(url, { useNewUrlParser: true },
    function (err, client) {
        if (err) {
            console.log("Err  ", err);
        } else {
            console.log("Connected successfully to server");
            db = client.db("fit2095db");
        }
    });


//week 5
//Insert new User
//GET request: send the page to the client
app.get('/', function (req, res) {
    res.sendFile(__dirname + '/views/home.html');
});
app.get('/newtask', function (req, res) {
    res.sendFile(__dirname + '/views/newTask.html');
});
//POST request: receive the details from the client and insert new document (i.e. object) to the collection (i.e. table)
app.post('/task', function (req, res) {
    let taskDetails = req.body;
    let taskId= Math.round(Math.random()*1000);
    let taskduedate = new Date(taskDetails.taskduedate);
    db.collection('tasks').insertOne({ taskId: taskId, taskname: taskDetails.taskname, taskassignto: taskDetails.taskassignto, taskduedate: taskduedate, taskstatus: taskDetails.taskstatus, taskdescription: taskDetails.taskdescription});
    res.redirect('listtask'); // redirect the client to list users page
});


//List all users
//GET request: send the page to the client. Get the list of documents form the collections and send it to the rendering engine
app.get('/listtask', function (req, res) {
    db.collection('tasks').find({}).toArray(function (err, data) {
        res.render('listtask', { tasksDb: data });
    });
});

//Update user: 
//GET request: send the page to the client 
app.get('/taskstatus', function (req, res) {
    db.collection('tasks').find({}).toArray(function (err, data) {
    res.render('taskstatus', { tasksDb: data });
    });
});

//POST request: receive the details from the client and do the update
app.post('/taskstatus', function (req, res) {
    let taskDetails = req.body;
    let filter = parseInt(req.body.taskId);
    let theUpdate = { $set: {taskstatus: taskDetails.taskstatus} };
    db.collection('tasks').updateOne({taskId: filter}, theUpdate, {upsert: false}, function(err, result){
        res.redirect('listtask');// redirect the client to list tasks page
    });
})

//delete task: 
//GET request: send the page to the client to delete the task
app.get('/deletetask', function (req, res) {
    db.collection('tasks').find({}).toArray(function (err, data) {
        res.render('deletetask', { tasksDb: data });
      // res.sendFile(__dirname + '/views/deletetask.html');
    });
});

//POST request: receive the task's name and do the delete operation 
app.post('/deletetask', function (req, res) {
    let taskDetails = req.body;
    let filter = parseInt(req.body.taskId);
    console.log(filter);
    db.collection('tasks').deleteOne({taskId: filter}, function(err, obj){
        res.redirect('/listtask');// redirect the client to list tasks page
    }); //mongodb.ObjectId(req.body)}
});

app.post('/deletecomptaskdata', function  (req, res){
    db.collection('tasks').deleteMany({taskstatus: 'complete'}, function(err, obj){
        res.redirect('listtask');
    });
});

app.get('/deletecomptask', function (req, res) {
    db.collection('tasks').find({}).toArray(function (err, data) {
        res.render('deletecomptask', { tasksDb: data });
      // res.sendFile(__dirname + '/views/deletetask.html');
    });
});

app.listen(8080);


// let task = {
//     taskname: 'Wash dishes',
//     taskdue:   '30/02/20',
//     taskdesc:  'wash with sunlight'
// }
// db.push(task);


// app.get('/', function (req, res) {
//     db.collection('tasks').find({}).toArray(function (err, data) {
//             res.render('home.html');
//     });
// });
// app.get('/newTask',function (req,res) {
//     res.render('newTask.html');
// });
// app.post('/task', function (req,res){
//     var newtaskname = req.body.taskname;
//     let newtaskdue = req.body.taskdue;
//     let newtaskdesc = req.body.taskdesc;
    
//     let newTask = {
//         taskname: newtaskname,
//         taskdue: newtaskdue,
//         taskdesc: newtaskdesc
//     };
//     db.push(newTask);
//     for(const item of db){
//         console.log(item);
//         }
//     res.send('<a href="/listtask"> Task Added, click to view now </a>')
// });
// app.get('/listTask', function(req,res) {
//     res.render('listtask.html', {db: db});
// });
