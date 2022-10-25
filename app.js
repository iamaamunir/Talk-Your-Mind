const express = require('express')
const app = express()
require('dotenv').config()






const {DbConnection} = require('./config/dbConnection')
DbConnection()


const PORT = process.env.PORT

app.listen(PORT, ()=>{
    console.log(`APP IS RUNNING AT ${PORT}`)
})