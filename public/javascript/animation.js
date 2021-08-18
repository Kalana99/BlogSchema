let wrappers = document.querySelectorAll('.wrapper');

//-------###login - signUp form toggle###-------------------

let loginForm = document.getElementById('loginForm');
let signUpForm = document.getElementById('signUpForm');
let btn = document.getElementById('btn');
let toggleBtns = document.querySelectorAll('.toggle-btn');

function loginForm_get(){

    loginForm.style.left = '310px';
    signUpForm.style.left = '750px';

    btn.style.left = '0px';
    
    toggleBtns[0].style.color = 'white';
    toggleBtns[1].style.color = 'rgb(20, 4, 255)';

    wrappers[0].classList.remove("inactive");
    wrappers[0].classList.add("active");

    wrappers[1].classList.remove("active");
    wrappers[1].classList.add("inactive");
}

function signUpForm_get(){

    loginForm.style.left = '-400px';
    signUpForm.style.left = '310px';

    btn.style.left = '110px';

    toggleBtns[1].style.color = 'white';
    toggleBtns[0].style.color = 'rgb(20, 4, 255)';

    wrappers[1].classList.remove("inactive");
    wrappers[1].classList.add("active");

    wrappers[0].classList.remove("active");
    wrappers[0].classList.add("inactive");
}

//---------###toggle password view###------------------------
let toggleView = document.querySelectorAll('.far');

let togglePasswordView = async (toggleView) => {
    for (let i = 0; i < toggleView.length; i++){
        let pswField = toggleView[i].parentElement.querySelector('input');

        toggleView[i].addEventListener('click', (event) => {
            // toggle the type attribute
            let type = pswField.getAttribute('type') === 'password' ? 'text' : 'password';
            pswField.setAttribute('type', type);
            // toggle the eye slash icon
            toggleView[i].classList.toggle('fa-eye-slash');
        });
    }
};

togglePasswordView(toggleView);

//--------###side menu ###-----------------------------------
function openNav() {
    document.getElementById("mySidenav").style.width = "350px";
    document.getElementById("proPicDiv").style.display = "none";
}
  
function closeNav() {
    document.getElementById("mySidenav").style.width = "0";
    document.getElementById("proPicDiv").style.display = "block";
}