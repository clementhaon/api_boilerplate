const user = require("./users/controller");


const Router = require('express').Router();

const { isAuthorized } = require("../app/core/auth");


Router.use('/user', isAuthorized, user);