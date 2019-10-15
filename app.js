const express = require('express');
const exphbs = require('express-handlebars');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const methodOveride = require('method-override');

const app = express();
const employees = require('./routes/employees');

//Map Mongoose Promises to Global Promises
mongoose.Promise = global.Promise

//Connect to MongoDB
mongoose.connect('mongodb://localhost/EmployeeDB',{
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log('MongoDB connected...'))
.catch(err => console.log(err));

// Express handlebars middleware
app.engine('handlebars', exphbs({
  defaultLayout: 'main'
}));
app.set('view engine', 'handlebars');

//Body parser middleware
app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(bodyParser.json());

// Method Override Middleware
app.use(methodOveride('_method'));

const PORT = process.env.PORT || 3000;

app.get('/', (req, res) => {
  res.render('index');
});

app.get('/about', (req, res) => {
  res.render('about');
});


app.use('/employees', employees);

app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
});