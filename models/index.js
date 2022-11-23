const Sequelize = require("sequelize");
const config = require('../app/config').getConfig();
const db = config.database;

const user = require("./users/model");


const sequelize = new Sequelize(
    `mysql://${db.username}:${db.password}@${db.host}:${db.port}/${db.name}`,
    {logging: false}
);

sequelize
    .authenticate()
    .then(() => {
        console.log("Database is now connected to the express server.");
    })
    .catch((error) => {
        console.error(error);
        console.error("Failed to connect to the database !");
    });

const models = {
    user: user(sequelize, dt),
};

Object.keys(models).forEach((modelName) => {
    if(models[modelName].associate) {
        models[modelName].associate(models);
    }
});

models.sequelize = sequelize;
models.Sequelize = Sequelize;


const force = process.env.FORCE_DB || false;
sequelize.sync({force}).then((e) => {
    console.log(
        force ? "Force synced database." : "Initialized database..(no forced & create)"
    );
});

module.exports = models;