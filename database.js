let mongoose = require('mongoose');
let db = mongoose.connection;

let User = require('./models/User');
let Blog = require('./models/Blog');

// let fs = require('fs');

mongoose.Promise = global.Promise;

let addUser = function(user){
    let temp = new User(user);
    temp.save();
    return temp._id;
}

let addBlog = function(blog) {
    let temp = new Blog(blog);
    temp.save();
    return temp._id;
}

let funcs = {
    addUser,
    addBlog
};

module.exports = funcs;