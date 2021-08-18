let express = require('express');
let app = express();

const { dirname } = require('path');

app.set('view engine', 'ejs');
app.set('views', 'public');

app.use(express.static(__dirname + '/public'));
app.use(express.urlencoded({extended: true}));
app.use(express.json());

//disabling browser the cache for all web pages
app.use(function(req, res, next) {
    res.set('Cache-Control', 'no-cache, private, no-store, must-revalidate, max-stale=0, post-check=0, pre-check=0');
    next();
});

let fileUpload = require('express-fileupload');
app.use(fileUpload());

//cookie - parser
let cookieParser = require('cookie-parser');
app.use(cookieParser());

//////////////
// parse application/x-www-form-urlencoded
// let bodyParser = require('body-parser');
// app.use(bodyParser.urlencoded({ extended: false }))

// // parse application/json
// app.use(bodyParser.json())
///////////////////

let mainRoutes = require('./routes/mainRoutes');
let validationRoutes = require('./routes/validationRoutes');
let verificationRoutes = require('./routes/verificationRoutes');

app.use(mainRoutes);
app.use(validationRoutes);
app.use(verificationRoutes);

let mongoose = require('mongoose');
let atlas = 'mongodb+srv://kalana:Kalana99@cluster0.wp4bo.mongodb.net/BlogSchema?retryWrites=true&w=majority'

mongoose.Promise = global.Promise;
mongoose.connect(atlas , {useNewUrlParser: true, useUnifiedTopology: true})
.then((result) => {
    app.listen(process.env.PORT || 3000); 
    console.log('You are listening to port 3000'); 
})
.catch((err) => console.log(err));