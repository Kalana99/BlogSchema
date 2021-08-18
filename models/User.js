let mongoose = require('mongoose');
let Schema = mongoose.Schema;
const bcrypt = require('bcryptjs');

let userSchema = new Schema({
    "Username": String,
    "email": String,
    "password": String,
    "profilePic": String,
    "profilePic_uploaded": Boolean,
    "verified": Boolean
});

userSchema.pre('save', async function(next){

    const salt = await bcrypt.genSalt();
    this.password = await bcrypt.hash(this.password, salt);

    next();
});

userSchema.statics.checkPassword = async function(id, current_password){
    
    const user = await this.findOne({_id: id});
    
    const auth = await bcrypt.compare(current_password, user.password);
    
    if(auth){
        user.passwordCorrect = true;
    }
    else{
        user.passwordCorrect = false;
    }
    
    return user;
};

const User = mongoose.model('User', userSchema);
module.exports = User;