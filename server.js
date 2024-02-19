const connect = require('./conn');
const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const router = require('./router');
require('dotenv').config();

const app = express();

/** middlewares */
app.use(express.json());
app.use(cors());
app.use(morgan('tiny'));
app.disable('x-powered-by'); // less hackers know about our stack



/** HTTP GET Request */
app.get('/home', (req, res) => {
    res.status(201).json("Home GET Request using ip");
});


/** api routes */
app.use('/api', router)

/** start server only when we have valid connection */
connect().then(() => {
    try {
        app.listen(process.env.PORT, () => {
            console.log(`Server connected to http://localhost:${process.env.PORT}`);
        })
    } catch (error) {
        console.log('Cannot connect to the server')
    }
}).catch(error => {
    console.log("Invalid database connection...!");
})