const mongoose = require('mongoose')
const schema = mongoose.Schema

// 13.Blogs created should have title, description, tags, author, timestamp, state,
// read_count, reading_time and body.
const articleSchema = new schema({
    title:{
        type:String,
        required:[true, 'Blog title is required'],
        unique:true
    },
    description:{
        type:String
    },
    author: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user'
      },
    state:{
        type:String,
        // 8. When a blog is created, it is in draft state
        default: 'draft',

        enum: ['draft', 'published']
    },
    read_count:{
        type:Number,
        default: 0
    },
    reading_time:{
        type: String
    },
    tags:{
        type: [String],

    },
    body:{
        type:String,
        unique:true,
        required:[true, 'Blog body is required']}
    ,
    timestamp:{
        type: Date
    
    }

})


module.exports = mongoose.model('article', articleSchema)