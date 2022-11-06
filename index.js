const app = require('./app')
const {DbConnection} = require('./config/dbConnection')

require('dotenv').config()

DbConnection()

const PORT = process.env.PORT

app.listen(PORT, ()=>{
    console.log('App is running at',PORT)
})