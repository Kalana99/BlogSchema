let nodemailer = require('nodemailer');

let server_email = 'blogschema.test101@gmail.com';
let server_email_psw = 'blogSchema101';

let transporter = nodemailer.createTransport({

    service: 'gmail',
    auth: {
        user: server_email,
        pass: server_email_psw
    }
});

module.exports = function(clientEmail, type, additionalData){

    data = {}

    if(type === 'signUp'){
        data = {
            from: server_email,
            to: clientEmail,
            subject: 'BlogSchema - Account verification',
            text: 'You have succesfully created your account. \nPlease click on the link below to verify your email address.\nhttp://localhost:3000/verify/'
            + additionalData.id + '\nAfterwards you can log in to the system.'
        }
    }
    else if(type === 'forgotPsw'){
        data = {
            from: server_email,
            to: clientEmail,
            subject: 'BlogSchema - Password restoring pin',
            text: 'To restrore your password, enter following pin code in the field provided and click confirm. \nPin code: ' + additionalData.sentPin
        }
    }
    else if(type === 'edit'){
        data = {
            from: server_email,
            to: clientEmail,
            subject: 'BlogSchema - New email verification',
            text: 'You have succesfully updated your account. \nPlease click on the link below to verify your new email address.\nhttp://localhost:3000/verify/'
            + additionalData.id + '\nAfterwards you can log in to the system using new credentials.'
        }
    }
    else if(type === 'again'){
        data = {
            from: server_email,
            to: clientEmail,
            subject: 'BlogSchema - New email verification',
            text: 'You have succesfully created/updated your account. \nPlease click on the link below to verify your new email address.\nhttp://localhost:3000/verify/'
            + additionalData.id
        }
    }

    transporter.sendMail(data, function(error, info){
        if(error){
            console.log(error);
        }
        else{
            console.log('email sent to ' + info.response);
        }
    });
}