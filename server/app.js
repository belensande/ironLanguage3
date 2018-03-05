const express        = require("express");
const path           = require("path");
const logger         = require("morgan");
const cookieParser   = require("cookie-parser");
const bodyParser     = require("body-parser");
const session		 = require("express-session");
const MongoStore	 = require('connect-mongo')(session);
const mongoose		 = require("mongoose");
const { dbURL }		 = require('./config');
const cors			 = require('cors');
const index			 = require('./routes/index');

const app            = express();

mongoose.connect(dbURL);

var whitelist = [
	'http://localhost:4200'
];

var corsOptions = {
	origin: function (origin, callback) {
		var originIsWhitelisted = whitelist.indexOf(origin) !== -1;
		callback(null, originIsWhitelisted);
	},
	credentials: true
};

app.use(cors(corsOptions));

app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser("iron-language"));
app.use(express.static(path.join(__dirname, 'public')));

app.use(session({
  secret: "iron-language",
  resave: true,
  saveUninitialized: true,
  cookie: { httpOnly: true, maxAge: 2419200000 },
  store: new MongoStore({ mongooseConnection: mongoose.connection })
}));

require('./passport')(app);

app.use('/', index);

/*app.all('/*', (req, res) => {
  res.sendFile(__dirname + '/public/index.html');
});*/

app.use(function (req, res, next) {
	var err = new Error();
	err.message = 'Not Found';
	err.status = 404;
	next(err);
});

app.use(function (err, req, res, next) {
	res.locals.message = err.message;
	res.locals.error = req.app.get('env') === 'development' ? err : {};

	res.status(err.status || 500);
	res.json({message: err.message});
});

module.exports = app;
