let mongoose = require('mongoose');
let Schema = mongoose.Schema;

let blogSchema = new Schema({
    "authorId": String,
    "title": String,
    "snippet": String,
    "content": String
},
{timestamps: true});

const Blog = mongoose.model('Blog', blogSchema);
module.exports = Blog;