const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const mongoose = require('mongoose');
const fs = require('fs');

const database = require('../database');
const mail = require('../sendMail');
const User = require('../models/User');
const Blog = require('../models/Blog');

const db = mongoose.connection;

const maxAge = 1 * 24 * 60 * 60;

const createToken = (data, type) => {

    if(type === "id"){
        return jwt.sign({id: data}, 'esghsierhgoisio43jh5294utjgft*/*/4t*4et490wujt4*/w4t*/t4', {
            expiresIn: maxAge
        });
    }
    else if(type === "email"){
        return jwt.sign({email: data}, 'esghsierhgoisio43jh5294utjgft*/*/4t*4et490wujt4*/w4t*/t4', {
            expiresIn: maxAge
        });
    }
    else if(type === "blogId"){
        return jwt.sign({curBlogId: data}, 'esghsierhgoisio43jh5294utjgft*/*/4t*4et490wujt4*/w4t*/t4', {
            expiresIn: maxAge
        });
    }
};

let password_encrypt = async function(newPsw){

    const salt = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash(newPsw, salt);
    return hashedPassword;
}

//--------------------main controllers----------------------------------------------//

module.exports.get_home = (req, res) => {
    res.redirect('/login');
}

module.exports.get_login = (req, res) => {
    res.render('login');
}

module.exports.post_signUp = (req, res) => {
    let data = req.body;
    
    let id = database.addUser(data);
    mail(req.body.email, 'signUp', {id: id});
    res.json({id: id});
}

module.exports.post_login = (req, res) => {
    
    if(Object.keys(req.body).length !== 0){

        db.collections.users.findOne({email: req.body.email})
        .then(profile => {
            let token = createToken(profile._id, "id");
            res.cookie('jwt', token, {httpOnly: true, maxAge: maxAge * 1000});
            res.json({});
        })
        .catch(error => {
            console.log(error);
        });
    }
}

module.exports.get_forgotPsw = (req, res) => {
    res.render('forgotPsw');
}

module.exports.post_getPin = (req, res) => {

    if(Object.keys(req.body).length !== 0){

        let data = {};

        db.collections.users.findOne({email: req.body.email})
        .then(user => {

            if(user){
                
                sentPin = Math.floor(Math.random()*1000000)

                mail(req.body.email, 'forgotPsw', {sentPin: sentPin});

                data['emailExists'] = true;
                data['sentPin'] = sentPin;

                let token = createToken(user.email, "email");
                res.cookie('jwtForgot', token, {httpOnly: true, maxAge: maxAge * 1000});
            }
            else{
                data['emailExists'] = false;
            }
            res.json(data);
        })
        .catch(error => {
            console.log(error);
        });
    }
}

module.exports.get_forgotChangePsw = (req, res) => {
    res.render('forgotChangePsw');
}

module.exports.put_forgotChangePsw = (req, res) => {

    if(Object.keys(req.body).length !== 0){
        let newPsw = req.body.password;
        const token = req.cookies.jwtForgot;

        jwt.verify(token, 'esghsierhgoisio43jh5294utjgft*/*/4t*4et490wujt4*/w4t*/t4', (err, decodedToken) => {
            
            let email = decodedToken.email;

            password_encrypt(newPsw)
            .then((hashedPassword) => {
                db.collections.users.findOneAndUpdate({email}, 
                {$set: {password: hashedPassword}}, function(err){
                    if (err){
                        console.log(err);
                    }
                    else{
                        console.log('password updated');
                        res.json({});
                    }
                });
            })
        });
    }
}

module.exports.get_main = (req, res) => {
    
    const token = req.cookies.jwt;

    jwt.verify(token, 'esghsierhgoisio43jh5294utjgft*/*/4t*4et490wujt4*/w4t*/t4', (err, decodedToken) => {
        let id = decodedToken.id;

        db.collections.users.findOne({_id: mongoose.Types.ObjectId(id)}).then(user => {
            
            db.collections.blogs.find().toArray( (error, blogs) => {
                if(error){
                    console.log(error);
                }
                else{

                    blogs.forEach((blog) => {
                        let obj = blog.createdAt;
                        let date = obj.toDateString();
                        let time = obj.toTimeString().split(' ')[0]

                        blog.date = date;
                        blog.time = time;
                    });

                    let data = {
                        user: user,
                        blogs: blogs.reverse()
                    };
                    res.render('main', data);
                }
            });
        });
    });
}

module.exports.get_profilePic = (req, res) => {
    const token = req.cookies.jwt;

    jwt.verify(token, 'esghsierhgoisio43jh5294utjgft*/*/4t*4et490wujt4*/w4t*/t4', (err, decodedToken) => {
        let id = decodedToken.id;

        db.collections.users.findOne({_id: mongoose.Types.ObjectId(id)}).then(user => {
            if(user.profilePic_uploaded){
                res.download('./profilePics/' + user.profilePic);
            }
            else{
                res.download('./profilePics/emptyPic.svg');
                // res.download('./profilePics/joker.jpg');
            }
        });
    });
}

module.exports.post_editProfilePic = (req, res) => {
    // console.log(req.body.fileName);
}

module.exports.get_editProfile = (req, res) => {
    
    const token = req.cookies.jwt;

    jwt.verify(token, 'esghsierhgoisio43jh5294utjgft*/*/4t*4et490wujt4*/w4t*/t4', (err, decodedToken) => {
        let id = decodedToken.id;

        db.collections.users.findOne({_id: mongoose.Types.ObjectId(id)}).then(user => {
            res.render('editProfile', {user});
        });
    });
}

module.exports.post_editProfile = async (req, res) => {

    if(Object.keys(req.body).length !== 0){
        
        const token = req.cookies.jwt;

        jwt.verify(token, 'esghsierhgoisio43jh5294utjgft*/*/4t*4et490wujt4*/w4t*/t4', async (err, decodedToken) => {
            let id = decodedToken.id;
            let data = req.body;

            if(Object.keys(data).includes('password')){
                try{
                    let hashedPassword = await password_encrypt(data.password);
                    data.password = hashedPassword;
                }
                catch(error){
                    console.log(error);
                } 
            }

            if(!Object.keys(data).includes('email')){

                db.collections.users.findOneAndUpdate({_id: mongoose.Types.ObjectId(id)},
                {$set: data}, {returnOriginal: false}, function(err, user){
                    if(err){
                        console.log(err);
                    }
                    else{
                        console.log("user data changed");
                        res.cookie('jwt', '', { maxAge: 1});
                        res.json({emailEdit: false, id: id});
                    }
                })
            }
            else{
                data.verified = false;

                db.collections.users.findOneAndUpdate({_id: mongoose.Types.ObjectId(id)},
                {$set: data}, {returnOriginal: false}, function(err, user){
                    if(err){
                        console.log(err);
                    }
                    else{
                        console.log("user data changed");
                        mail(req.body.email, 'edit', {id: id});
                        res.cookie('jwt', '', { maxAge: 1});
                        res.json({emailEdit: true, id: id})
                    }
                })
            }
        });

    }
}

module.exports.get_about = (req, res) => {
    res.render('about');
}

module.exports.get_logout = (req, res) => {
    res.cookie('jwt', '', { maxAge: 1});
    res.redirect('/login');
};

//----------------------------------------------------------------------------------//

//--------------------------blog controllers----------------------------------------//

module.exports.get_newBlog = (req, res) => {
    
    const token = req.cookies.jwt;

    jwt.verify(token, 'esghsierhgoisio43jh5294utjgft*/*/4t*4et490wujt4*/w4t*/t4', (err, decodedToken) => {
        let id = decodedToken.id;

        db.collections.users.findOne({_id: mongoose.Types.ObjectId(id)}).then(user => {
            res.render('editBlog', {user});
        });
    });
}

module.exports.post_newBlog = (req, res) => {
    
    const token = req.cookies.jwt;

    jwt.verify(token, 'esghsierhgoisio43jh5294utjgft*/*/4t*4et490wujt4*/w4t*/t4', (err, decodedToken) => {
        
        let id = decodedToken.id;

        if(Object.keys(req.body).length !== 0){
            let data = req.body;
            data['authorId'] = id;

            if(data.title === ''){
                data.title = 'Untitled';
            }
            if(data.snippet === ''){
                data.snippet = '---';
            }
            if(data.content === ''){
                data.content = 'no-content';
            }

            let blogId = database.addBlog(data);
            console.log('blog saved');
            
        }
    });

    res.json({});
}

module.exports.get_editBlogDetails = (req, res) => {

    const blogToken = req.cookies.jwtBlog;

    jwt.verify(blogToken, 'esghsierhgoisio43jh5294utjgft*/*/4t*4et490wujt4*/w4t*/t4', (err, decodedToken) => {
        let blogId = decodedToken.curBlogId;
        
        db.collections.blogs.findOne({_id: mongoose.Types.ObjectId(blogId)}).then(blog => {
            res.json(blog);
        });
    });
}

module.exports.get_editBlog = (req, res) => {
    
    const token = req.cookies.jwt;

    jwt.verify(token, 'esghsierhgoisio43jh5294utjgft*/*/4t*4et490wujt4*/w4t*/t4', (err, decodedToken) => {
        let id = decodedToken.id;

        db.collections.users.findOne({_id: mongoose.Types.ObjectId(id)}).then(user => {
            res.render('editBlog', {user});
        });
    });
}

module.exports.post_editBlog = (req, res) => {

    const token = req.cookies.jwtBlog;

    jwt.verify(token, 'esghsierhgoisio43jh5294utjgft*/*/4t*4et490wujt4*/w4t*/t4', (err, decodedToken) => {
        let blogId = decodedToken.curBlogId;

        if(Object.keys(req.body).length !== 0){

            let data = req.body;

            db.collections.blogs.findOneAndUpdate({_id: mongoose.Types.ObjectId(blogId)},
            {$set: data}, {returnOriginal: false}, function(err, blog){
                if(err){
                    console.log(err);
                }
                else{
                    console.log("blog data changed");
                    res.json({});
                }
            });
        }
        else{
            res.redirect('/viewMyBlog/' + blogId);
        }
    });
}

module.exports.get_myBlogs = (req, res) => {
    
    const token = req.cookies.jwt;

    jwt.verify(token, 'esghsierhgoisio43jh5294utjgft*/*/4t*4et490wujt4*/w4t*/t4', (err, decodedToken) => {
        let id = decodedToken.id;

        db.collections.users.findOne({_id: mongoose.Types.ObjectId(id)}).then(user => {
            
            db.collections.blogs.find({authorId: id}).toArray( (error, myBlogs) => {
                if(error){
                    console.log(error);
                }
                else{

                    myBlogs.forEach((blog) => {
                        let obj = blog.createdAt;
                        let date = obj.toDateString();
                        let time = obj.toTimeString().split(' ')[0]

                        blog.date = date;
                        blog.time = time;
                    });

                    let data = {
                        user: user,
                        myBlogs: myBlogs.reverse()
                    };
                    res.render('myBlogs', data);
                }
            });
        });
    });
}

module.exports.get_viewBlog = (req, res) => {

    
    
    const token = req.cookies.jwt;

    jwt.verify(token, 'esghsierhgoisio43jh5294utjgft*/*/4t*4et490wujt4*/w4t*/t4', (err, decodedToken) => {
        let id = decodedToken.id;

        db.collections.users.findOne({_id: mongoose.Types.ObjectId(id)}).then(user => {
            let blogId = req.params.id;
            db.collections.blogs.findOne({_id: mongoose.Types.ObjectId(blogId)}).then(blog => {
                db.collections.users.findOne({_id: mongoose.Types.ObjectId(blog.authorId)}).then(author => {

                    let obj = blog.createdAt;
                    let date = obj.toDateString();
                    let time = obj.toTimeString().split(' ')[0]

                    blog.date = date;
                    blog.time = time;

                    let data = {
                        user: user,
                        blog: blog,
                        author: author
                    }
                    res.render('viewBlog', data);
                })
            })
        });
    });
}

module.exports.get_viewMyBlog = (req, res) => {
    
    let blogId = req.params.id;
    db.collections.blogs.findOne({_id: mongoose.Types.ObjectId(blogId)}).then(blog => {
        db.collections.users.findOne({_id: mongoose.Types.ObjectId(blog.authorId)}).then(author => {

            let obj = blog.createdAt;
            let date = obj.toDateString();
            let time = obj.toTimeString().split(' ')[0]

            blog.date = date;
            blog.time = time;

            let data = {
                user: author,
                blog: blog,
                author: author
            }

            let token = createToken(blog._id, "blogId");
            res.cookie('jwtBlog', token, {httpOnly: true, maxAge: maxAge * 1000});
            res.render('viewMyBlog', data);
        })
    })
}

module.exports.get_deleteBlog = (req, res) => {
    const token = req.cookies.jwtBlog;

    jwt.verify(token, 'esghsierhgoisio43jh5294utjgft*/*/4t*4et490wujt4*/w4t*/t4', (err, decodedToken) => {
        let blogId = decodedToken.curBlogId;

        db.collections.blogs.findOneAndDelete({_id: mongoose.Types.ObjectId(blogId)}).then(data => {
            console.log("blog deleted");
            res.cookie('jwtBlog', '', { maxAge: 1});
            res.redirect("/myBlogs");
        })
    });
}

//-------------------------------------------------------------------------------------//