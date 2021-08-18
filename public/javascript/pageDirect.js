// const { get } = require("../../routes/mainRoutes");

let finalize = async (page, normal, nonEmpty, newPassword, existingPassword, newEmail, existingEmail, editNormal, editEmail, editPassword) => {

    if(page === 'signUp'){
        
        data ={};

        data['Username'] = querySelectorFrom('.Username', nonEmpty)[0].value;
        data['email'] = querySelectorFrom('.newEmail', newEmail)[0].value;
        data['password'] = querySelectorFrom('.newPassword', newPassword)[0].value;
        data['profilePic'] = '';
        data['profilePic_uploaded'] = false;
        data['verified'] = false;
        
        fetch('/signUp', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        })
        .then(res => res.json())
        .then(response => {
            window.location.href = '/verifyemail/' + response.id;
        })
        .catch((error) => {
            console.log(error);
        });

    }

    else if(page === 'login'){

        email = existingEmail[0].value;
        
        let response = await fetch('/login', {
            method: 'POST', // or 'PUT'
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({email}),
        });
        let data = await response.json();
        window.location.href = '/main';

    }

    else if(page === 'forgotChangePsw'){

        password = newPassword[0].value;
        
        let response = await fetch('/forgotChangePsw', {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({password}),
        });
        let data = await response.json();
        window.location.href = '/login';

    }

    else if(page === 'newBlog'){

        let data = {};

        data['title'] = normal[0].value;
        data['snippet'] = normal[1].value;
        data['content'] = normal[2].value;

        fetch('/newBlog', {
            method: 'POST', // or 'PUT'
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data)
        })
        .then(res => res.json())
        .then(response => {
            window.location.href = '/main';
        })
        .catch((error) => {
            console.log(error);
        })
    }

    else if(page === 'editBlog'){

        let data = {};

        if(normal[0].value !== ""){
            data['title'] = normal[0].value;
        }
        if(normal[1].value !== ""){
            data['snippet'] = normal[1].value;
        }
        if(normal[2].value !== ""){
            data['content'] = normal[2].value;
        }

        let response = await fetch('/editBlog', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        })
        
        window.history.back();
    }

    else if(page === 'editProfile'){

        let data = {};

        if(editNormal[0].value !== ''){
            data['Username'] = editNormal[0].value;
        }
        if(editEmail[0].value !== ''){
            data['email'] = editEmail[0].value;
        }
        if(editPassword[0].value !== ''){
            data['password'] = editPassword[0].value;
        }

        if(Object.keys(data).length === 0){
            window.location.href = '/main';
        }
        else{
            
            let response = await fetch('/editProfile', {
                method: 'POST', // or 'PUT'
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data),
            });
            let res = await response.json();
            
            if(res.emailEdit){
                window.location.href = '/verifyemail/' + res.id;
            }
            else{
                window.location.href = '/login';
            }
        }
    }
}

// profile picture edit function
let inputDP = document.querySelector('.fileEditProfile');

function editProfilePic(){
    inputDP.click();

    inputDP.onchange = function(event){
        let formElement = document.querySelector('#EditProfilePicForm');
        formElement.submit();
    }
}

let setError = (input, message) => {

    let formControl = input.parentElement;
    let small = formControl.querySelector('small');

    small.innerText = message;

    formControl.className = 'form-control error'
}

let setVerError = (input, message, id) => {

    let formControl = input.parentElement;
    let small = formControl.querySelector('small');
    let a = formControl.querySelector('a');

    small.innerText = message;
    a.innerText = 'click here to verify';
    a.setAttribute('href', '/verifyemail/' + id);
    a.setAttribute('class', 'ver-error');

    formControl.className = 'form-control error'
}

let setSuccess = (input) => {

    let formControl = input.parentElement;
    formControl.className = 'form-control success';
}

let removeError = (input) => {
    let formControl = input.parentElement; // .form-control
    let small = formControl.querySelector('small');

    small.innerText = "";
    formControl.className = 'form-control';
}

async function isEmail(email){
    //RegExr email validation
    //no need to understand
    //reference - https://codepen.io/FlorinPop17/pen/OJJKQeK
    return /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(email);
}

function querySelectorFrom(selector, elements) {
    return [].filter.call(elements, function(element) {
        return element.matches(selector);
    });
}

function addPinSubmit(formControlBtn){

    let formControl = document.createElement('div');
    formControl.setAttribute('class', 'form-control');

    let pinIcon = document.createElement('img');
    pinIcon.setAttribute('src', './resources/map-pin-solid.svg');
    pinIcon.setAttribute('alt', 'pin icon');
    pinIcon.setAttribute('class', 'input-icon');

    formControl.appendChild(pinIcon);
    
    // add pincode input field
    let pinInput = document.createElement('input');
    pinInput.setAttribute('class', 'pinCode forgotPassword');
    pinInput.setAttribute('type', 'text');
    pinInput.setAttribute('name', 'pin');
    pinInput.setAttribute('placeholder', 'Enter your pin');

    formControl.appendChild(pinInput);

    let pinLebel = document.createElement('label');
    pinLebel.setAttribute('for', 'pin');
    pinLebel.setAttribute('class', 'form-label');
    pinLebel.innerText = 'Pincode :';

    formControl.appendChild(pinLebel);

    let successIcon = document.createElement('i');
    successIcon.setAttribute('class', 'fa fa-check-circle');
    let errorIcon = document.createElement('i');
    errorIcon.setAttribute('class', 'fa fa-exclamation-circle');
    let errorMsg = document.createElement('small');
    errorMsg.innerText = 'Error message';

    formControl.appendChild(successIcon);
    formControl.appendChild(errorIcon);
    formControl.appendChild(errorMsg);

    // add formControl to the form
    let form = document.getElementById('forgotPswForm');
    form.insertBefore(formControl, form.childNodes[2]);

    // add pinsubmit button
    let pinSubmitBtn = document.createElement('button');
    pinSubmitBtn.setAttribute('type', 'button');
    pinSubmitBtn.setAttribute('class', 'button forgotPassword');
    pinSubmitBtn.setAttribute('id', 'pinSubmitBtn');
    pinSubmitBtn.setAttribute('onclick', 'submitPin()');
    let buttonText = document.createElement('span');
    buttonText.setAttribute('class', 'buttonText');
    buttonText.innerText = "Confirm";
    pinSubmitBtn.appendChild(buttonText);
    formControlBtn.appendChild(pinSubmitBtn);
}

function submitPin(){
    let pinInput = document.querySelector('.pinCode.forgotPassword');
    // let formControl = pinInput.parentElement;

    let pin = pinInput.value;
    
    if (pin === ''){
        setError(pinInput, 'Enter the pin number');
    }
    else if (sentPin == pin){
        setSuccess(pinInput);
        window.location.href = '/forgotChangePsw';
    }
    else if (sentPin != pin){
        setError(pinInput, 'Wrong pin number');
    }
}

async function getEditWindow(){

    let response = await fetch('/editBlogDetails', {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        }
    });
    let blog = await response.json();

    window.sessionStorage.blogId = blog._id;
    window.sessionStorage.title = blog.title;
    window.sessionStorage.snippet = blog.snippet;
    window.sessionStorage.content = blog.content;

    window.location.href = '/editBlog';
}

let correct = true;
let sentPin = null;

let validateNonEmpty = async (nonEmpty) => {
    
    for(let i = 0; i < nonEmpty.length; i++){

        let input = nonEmpty[i];
        let fieldName = input.name;

        let errMsg = fieldName + " cannot be blank!";

        if(input.value !== ''){
            setSuccess(input);
        }else{
            setError(input, errMsg);
            correct = false;
        }
    }
}

let validateNewPassword = async (oldPsw, psw) => {
    
    if(psw.length !== 0){

        let newPswField = psw[0];
        let confirmPswField = psw[1];

        if (newPswField.value === ''){
            setError(newPswField, 'Password cannot be blank');
            correct = false;
        }
        else if(newPswField.value.length < 6){
            setError(newPswField, 'Password must be at least 6-digits long');
            correct = false;
        }
        else{
            setSuccess(newPswField);
            if (confirmPswField.value === ''){
                setError(confirmPswField, 'You must confirm the password');
                correct = false;
            }
            else if (confirmPswField.value.trim() !== newPswField.value.trim()){
                setError(confirmPswField, 'Password mismatch');
                correct = false;
            }
            else{
                setSuccess(confirmPswField);
            }
        }
    }
}

let validateNewEmail = async (emailInput) => {
    //state --> 'blank', 'success', 'error', notAnEmail'.
    let emailState;
    
    for (let i=0; i<emailInput.length; i++){
        let email = emailInput[i];
        let emailValue = email.value.trim();

        if (emailValue === ''){
            emailState = "blank";
        }
        else if (! await (isEmail(emailValue))){
            
            emailState = 'notAnEmail';
        }
        else{
            
            let requestData = {email: emailValue};

            let response = await fetch('/checkEmailExistence', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(requestData),
            });

            let data = await response.json();
            
            if (data.emailExists){
                emailState = 'error';   //email must be a new unused one
            }
            else{
                emailState = 'success';
            }
        }

        //calling setError and setSuccess according to email state
        if (emailState === 'blank'){
            setError(email, 'Email cannot be blank');
            correct = false;
        }
        else if (emailState === 'notAnEmail'){
            setError(email, 'Not a valid Email');
            correct = false;
        }
        else if (emailState === 'error'){
            setError(email, 'Email already exists');
            correct = false;
        }
        else if (emailState === 'success'){
            setSuccess(email);
        }
        
    }
};

let validateExistingEmailAndPassword = async (emailInput, pswInput) => {

    // let loginButton = document.querySelector('.loginButton');
    let emailState;
    let password
    let passwordState;

    //emailInput always has elements
    for (let i = 0; i < emailInput.length; i++){

        let email = emailInput[i];
        let emailValue = email.value.trim();
        let data;

        if (emailValue === ''){
            emailState = "blank";
        }
        else if (! await (isEmail(emailValue))){
            emailState = "invalid";
        }
        else{

            //object will be sent only with an email if there's no password field
            let requestData = {email: emailValue};
            let passwordValue;

            password = null;

            //if there is a password field,
            if (pswInput != null){
                password = pswInput[i];
                passwordValue = password.value.trim();
                if (passwordValue === ''){
                    passwordState = "blank";
                }
                
                //add password to the data object
                requestData.password = passwordValue;
                
            }

            let response = await fetch('/checkEmailAndPassword', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(requestData),
                });

            data = await response.json();
            
            if(data.emailExists){
                emailState = "success";
                if (data.passwordCorrect != null){
                    if (data.passwordCorrect){
                        passwordState = "success";
                    }
                    else{
                        if (passwordValue != ''){
                            passwordState = "error";
                        }
                    }
                }
            }
            else{
                emailState = "error";
            }

        }   

        if (emailState === "blank"){
            setError(email, "Email cannot be blank");
            correct = false;
        }
        else if (emailState === "invalid"){
            setError(email, "Invalid email");
            correct = false;
        }
        else if (emailState === "success"){
            if (data.verified){
                setSuccess(email);
            }
            else{
                setVerError(email, "Email is not verified!", data.id);
                correct = false;
            }  
        }
        else if (emailState === "error"){
            setError(email, "Email does not exist");
            passwordState = null;
            correct = false;
        }

        if (passwordState === "blank"){
            setError(password, "Password cannot be blank");
            correct = false;
        }
        else if (passwordState === "success"){
            setSuccess(password);
        }
        else if (passwordState === "error"){
            setError(password, "Incorrect password");
            correct = false;
        }
        else{
            removeError(password);
            correct = false;
        }
    }

    
};

let validateExistingPassword = async (pswInput, existingEmail) => {

    // If there is also an existing email input in the page, then go to the validate
    // existing email and password
    if(existingEmail.length > 0){
        await validateExistingEmailAndPassword(existingEmail, pswInput);
        return;
    }

    let password = null;
    let passwordValue;
    //if there is a password field,
    if (pswInput[0] != null){
        password = pswInput[0];
        passwordValue = password.value.trim();
        if (passwordValue === ''){
            passwordState = "blank";
        }
        else{
            let response = await fetch('/checkPassword', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({password: passwordValue}),
                });
        
            data = await response.json();
            
            if(data.passwordCorrect){
                passwordState = 'success';
            }
            else{
                passwordState = 'wrong';
            }
    
            }
            if(passwordState === 'success'){
                setSuccess(password);
            }
            else if(passwordState === 'wrong'){
                setError(password, 'Please enter the correct password');
                correct = false;
            }
            else if(passwordState === 'blank'){
                setError(password, 'Current password cannot be blank');
                correct = false;
        }
    }

};

let validateForgotPswEmail = async (emailInput) => {

    emailState = null;

    for(let i = 0; i < emailInput.length; i++){
        email = emailInput[0].value.trim();

        if(email === ''){
            emailState = "blank";
        }
        else if(!isEmail(email)){
            emailState = "invalid";
        }
        else{
            let requestData = {email: email};

            let response = await fetch('/getPin', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(requestData),
            });

            let data = await response.json();
            sentPin = data.sentPin;
            
            if(data.emailExists){
                emailState = "success";
            }
            else{
                emailState = "non-exsisting";
            }
        }

        if (emailState === "blank"){
            setError(emailInput[0], "Email cannot be blank");
            correct = false;
        }
        else if (emailState === "invalid"){
            setError(emailInput[0], "Invalid email");
            correct = false;
        }
        else if (emailState === "non-exsisting"){
            setError(emailInput[0], "Email is not registered");
            correct = false;
        }
        else if (emailState === "success"){
            setSuccess(emailInput[0]);

            let submitBtn = document.querySelector('#forgotPswSubmit');
            let formControlBtn = submitBtn.parentElement;

            submitBtn.style.display = 'none';

            addPinSubmit(formControlBtn);
        }
    }
}

let validateEditEmail = async (emailInput) => {
    let emailState;

    if(emailInput.length > 0){
        let email = emailInput[0].value.trim();

        if(email !== ''){
            
            if(! await (isEmail(email))){
                emailState = 'invalid';
            }
            else{
                let requestData = {email: email};

                let response = await fetch('/checkEmailExistence', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(requestData),
                });

                let data = await response.json();
                
                if (data.emailExists){
                    emailState = 'exists';   //email must be a new unused one
                }
                else{
                    emailState = 'success';
                }
            }

            if (emailState === 'invalid'){
                setError(emailInput[0], 'Not a valid Email');
                correct = false;
            }
            else if (emailState === 'exists'){
                setError(emailInput[0], 'Email already exists');
                correct = false;
            }
            else if (emailState === 'success'){
                setSuccess(emailInput[0]);
            }
        }
    }
}

let validateEditPassword = async (pswInput) => {

    if(pswInput.length > 0){

        let newPswField = pswInput[0];
        let confirmPswField = pswInput[1];

        if(newPswField.value === ''){

            
            setError(confirmPswField, 'Password cannot be blank');
            correct = false;

            if (confirmPswField.value !== ''){
                setError(confirmPswField, 'Cannot confirm an empty password');
                correct = false;
            }
        }
        else if(newPswField.value.length < 6){
            setError(newPswField, 'Password must be at least 6-digits long');
            correct = false;
        }
        else{
            
            setSuccess(newPswField);
            
            if (confirmPswField.value === ''){
                setError(confirmPswField, 'You must confirm the password');
                correct = false;
            }
            else if (confirmPswField.value.trim() !== newPswField.value.trim()){
                setError(confirmPswField, 'Password mismatch');
                correct = false;
            }
            else{
                setSuccess(confirmPswField);
            }
        }
    }
}

let main = async (page) => {

    correct = true;
    
    let normal = document.querySelectorAll('.normal.' + page);
    let nonEmpty = document.querySelectorAll('.nonEmpty.' + page);
    let newPassword = document.querySelectorAll('.newPassword.' + page);
    let existingPassword = document.querySelectorAll('.existingPassword.' + page);
    let newEmail = document.querySelectorAll('.newEmail.' + page);
    let existingEmail = document.querySelectorAll('.existingEmail.' + page);
    let forgotPswEmail = document.querySelectorAll('.forgotPswEmail.' + page);
    let editNormal = document.querySelectorAll('.editNormal.' + page);
    let editEmail = document.querySelectorAll('.editEmail.' + page);
    let editPassword = document.querySelectorAll('.editPassword.' + page);

    let button = document.querySelector('.button.' + page);

    await validateNonEmpty(nonEmpty);

    await validateNewPassword(existingPassword, newPassword);

    await validateNewEmail(newEmail);

    await validateExistingPassword(existingPassword, existingEmail);

    await validateForgotPswEmail(forgotPswEmail);

    await validateEditEmail(editEmail);

    await validateEditPassword(editPassword);
    
    if(correct){
        
        //loading animation for buttons
        if (button !== null){
            button.classList.toggle('loading');
        }
        
        await finalize(page, normal, nonEmpty, newPassword, existingPassword, newEmail, existingEmail, editNormal, editEmail, editPassword);
    }

}

let setEventListeners = () => {
    
    let loginSubmit = document.getElementById('loginSubmit')
    if(loginSubmit){
        loginSubmit.addEventListener('click', function(event){
            event.preventDefault();
            main('login');
        });
    }

    let signUpSubmit = document.getElementById('signUpSubmit')
    if(signUpSubmit){
        signUpSubmit.addEventListener('click', function(event){
            main('signUp');
        });
    }

    let forgotPswSubmit = document.getElementById('forgotPswSubmit')
    if(forgotPswSubmit){
        forgotPswSubmit.addEventListener('click', function(event){
            event.preventDefault();
            main('forgotPsw');
        });
    }

    let forgotChangePswSubmit = document.getElementById('forgotChangePswSubmit')
    if(forgotChangePswSubmit){
        forgotChangePswSubmit.addEventListener('click', function(event){
            // event.preventDefault();
            main('forgotChangePsw');
        });
    }

    let editBlogSubmit = document.getElementById('editBlogSubmit')
    if(editBlogSubmit){
        editBlogSubmit.addEventListener('click', function(event){
            main('newBlog');
        });
    }

    let editBlogUpdate = document.getElementById('editBlogUpdate')
    if(editBlogUpdate){
        editBlogUpdate.addEventListener('click', function(event){
            main('editBlog');
        });
    }

    let editProfileSubmit = document.getElementById('editProfileSubmit')
    if(editProfileSubmit){
        editProfileSubmit.addEventListener('click', function(event){
            main('editProfile');
        });
    }

}

setEventListeners();