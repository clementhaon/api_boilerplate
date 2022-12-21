import express from "express";
import models from "../index.js";
const app = express.Router();


const register = async (req, res) => {


    try {
        console.log("la")
        console.log(req.body)

        //Check entry
        if (!req.body) throw new Error("missing params");
        if (!req.body.email) throw new Error("missing params");
        if (!req.body.password) throw new Error("missing params");
        if (!req.body.firstName) throw new Error("missing params");
        if (!req.body.lastName) throw new Error("missing params");
        if (!req.body.birthDate) throw new Error("missing params");
        if (!req.body.cgu) throw new Error("missing params");
        if (!req.body.privacyPolicy) throw new Error("missing params");

        console.log(0);
        const userExists = await models.user.findOne({ where: { email: req.body.email } });
        console.log(1)

        if (userExists) throw new Error('user already exist');

        const userCreate = await models.user.create({
            email: req.body.email,
            password: req.body.password,
            firstName: req.body.firstName,
            lastName: req.body.lastName,
            birthDate: req.body.birthDate,
            cgu: req.body.cgu,
            privacyPolicy: req.body.privacyPolicy,
        });
        if (!userCreate) throw new Error ("Error in creation user");
        console.log(2)
        try {
            //Launch function login in model user
            await userCreate.login();
            console.log(3)
            //Save the login
            await userCreate.save();
        } catch (err) {
            console.log("generating token failed : ", err);
            throw new Error("genreate token failed")
        }
        console.log(4)

        const responseGenric = await userCreate.toAuthJSON();

        return res.status(200).json(responseGenric);
    
    } catch (err) {
        console.log(err)

        return res.status(500).send({success:false, message: err?.message ? err?.message : ""});

    }


}

app.post('/register', register);

export default app;