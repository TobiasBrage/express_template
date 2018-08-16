const express    = require('express');
const session    = require('express-session');
const app        = express();
const path       = require('path');
const bodyParser = require('body-parser');

app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

require("./routes/routes") (app);
require("./config/db_config") (app);

app.use(express.static('public'));

const port = 3000;
app.listen(port);
console.log(`Server started http://localhost:${port}`);