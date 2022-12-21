import Sequelize from "sequelize";
import * as db from "../app/config/index.js";
import user from "./users/model.js";
import dotenv from 'dotenv'
dotenv.config({ silent: true });
const dt = Sequelize.DataTypes;

const sequelize = new Sequelize(
    `${process.env.DB_NAME}`, `${process.env.DB_USERNAME}`, `${process.env.DB_PASS}`,
    {
        dialect: 'mysql',
        logging: false
    }
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

//TODO uncomment when add table relation
/*Object.keys(models).forEach((modelName) => {
    if(models[modelName].associate) {
        models[modelName].associate(models);
    }
});*/

models.sequelize = sequelize;
models.Sequelize = Sequelize;


const force = process.env.FORCE_DB || false;
sequelize.sync({force}).then((e) => {
    console.log(
        force ? "Force synced database." : "Initialized database..(no forced & create)"
    );
});

export default models;