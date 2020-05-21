const express = require("express");
//const routes = require("./routes");
const sequelize = require("./config/connection");
const path = require("path");

const app = express();
const PORT = process.env.PORT || 3001;
const exphbs = require("express-handlebars");
//const hbs = exphbs.create({});

const helpers = require("./utils/helpers");

const hbs = exphbs.create({ helpers });

const session = require("express-session");
const SequelizeStore = require("connect-session-sequelize")(session.Store);

const sess = {
  secret: "Super secret secret",
  cookie: {},
  resave: false,
  saveUninitialized: true,
  store: new SequelizeStore({
    db: sequelize,
  }),
};

app.use(session(sess));

app.engine("handlebars", hbs.engine);
app.set("view engine", "handlebars");

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));

// turn on routes
//app.use(routes);
app.use(require("./controllers/"));

// turn on connection to db and server
// force: true => DROP TABLE IF EXISTS; recreate tables
sequelize.sync({ force: false }).then(() => {
  app.listen(PORT, () => console.log("Now listening"));
});
