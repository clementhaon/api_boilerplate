import express from "express";
import jsonwebtoken from "jsonwebtoken";
import models from "../index";
const app = express.Router();


const testT = (req, res) => {

    try {

        return res.status(200).json('lee');

    } catch (err) {
        console.log(err)

        return res.status(500).send({success:false, message: err?.message ? err?.message : ""});

    }


}

app.get('test', testT);

export default app;