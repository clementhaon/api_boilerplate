require('dotenv').config();
import http from 'http';
const middlewares = require('./app/core/middlewares');
import express from 'express';
import cors from 'cors';
const PORT = process.env.port || 5000;
const Router = require('./models/router');


const jsonErrorHandler = async (err, req, res) => {
    let content = {};
    err.message ? (content.message = err.message) : "";
    err.status ? (content.status = err.status) : "";
    Object.values(content).length > 0 ? "" : (content = err);
    res.status(err.status ? err.status : 500).send(content);
};

const app = express();

app.use('*', cors);
app.use(express.urlencoded({extended: false}));
app.use(express.json());
app.use(middlewares.cors);
app.use('/api', Router);
app.use(jsonErrorHandler);


const httpServer = http.createServer(app);
httpServer.listen(PORT, () => 
    console.log(`http server listening on port${PORT}`)
);