const express= require('express')
const app= express();
const cors= require('cors');
const env = require('dotenv');
const mongoose = require('mongoose');
env.config();

//Database connection configuration
const URI= process.env.MONGODB_URL;

mongoose.connect(URI, err => {
    if(!err){
        console.log('connected to Mongodb');
    }
    else{
        console.log('Error in connection', JSON.stringify(err, undefined, 2));
    }
})

//Routes configuration
app.use(cors({origin:'http://localhost:4200'}));
app.use(express.json());
app.use('/user', require('./routes/userRoutes') );

//listening to the server port
const PORT = process.env.PORT || 5000
app.listen(PORT, ()=>{
    console.log(`Server is running at port ${PORT}`);
})