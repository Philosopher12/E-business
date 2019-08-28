let express = require('express');
let app = express();
let bodyParser = require('body-parser');

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



let db = [];

let task = {
    taskname: 'Wash dishes',
    taskdue:   '30/02/20',
    taskdesc:  'wash with sunlight'
}
db.push(task);


app.get('/', function (req, res) {
    res.render('home.html');
});
app.get('/newTask',function (req,res) {
    res.render('newTask.html');
});
app.post('/task', function (req,res){
    var newtaskname = req.body.taskname;
    let newtaskdue = req.body.taskdue;
    let newtaskdesc = req.body.taskdesc;
    
    let newTask = {
        taskname: newtaskname,
        taskdue: newtaskdue,
        taskdesc: newtaskdesc
    };
    db.push(newTask);
    for(const item of db){
        console.log(item);
        }
    res.send('<a href="/listtask"> Task Added, click to view now </a>')
});
app.get('/listTask', function(req,res) {
    res.render('listtask.html', {db: db});
});
app.listen(8080);