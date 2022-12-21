import Router from 'express';
const app = Router.Router();


const testT = (req, res) => {


    res.status(200).send({success: true});


}

app.get('test', testT);

export default app