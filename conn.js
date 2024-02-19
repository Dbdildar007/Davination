const mongoose = require('mongoose')
require('dotenv').config();


const connect = async()=>{
    try{
        mongoose.connect(process.env.uri,{
            
        }).then(()=>{
            console.log();
        }).catch((error)=>{
            console.log("Error while connecting to Mongo",error);
        })

    }catch(e){
        console.log('Error is here in catch block!',e);
    }
}
module.exports = connect;