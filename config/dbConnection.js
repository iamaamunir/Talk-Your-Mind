const mongoose = require('mongoose')
require('dotenv').config()

function DbConnection(){
    mongoose.connect(process.env.MONGODB_URL)
    mongoose.connection.on('connected', ()=>{
        console.log('Connection to MongoDB is successful')
    })
    mongoose.connection.on('error', (err)=>{
        console.log('Unable to Connect to MongoDB')
    })
}

module.exports = {DbConnection}