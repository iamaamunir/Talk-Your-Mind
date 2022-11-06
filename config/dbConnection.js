const mongoose = require('mongoose')
require('dotenv').config()

const MongoDB_URL = process.env.MongoDB_URL


function DbConnection(){
    console.log(MongoDB_URL)
    mongoose.connect(MongoDB_URL)
    mongoose.connection.on('connected', ()=>{
        console.log('Connection to MongoDB is successful')
    })
    mongoose.connection.on('error', (err)=>{
        console.log('Unable to Connect to MongoDB')
    })
}

module.exports = {DbConnection}