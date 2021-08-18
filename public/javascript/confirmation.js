let activePopupWindow           = null;
let popupWindow                 = document.querySelectorAll('.popup-window');

function toggleActive(){
    popupWindow[0].classList.toggle('active');
}

function submitLogout(){
    document.querySelector('.submit-logout').classList.toggle('loading');
    window.location.href = '/logout';
}

let delBtnDiv = document.querySelectorAll('.deleteBlog_btn');

if(delBtnDiv.length > 0){

    let span = document.createElement('span')
    span.setAttribute('class', 'buttonText');
    span.innerText = 'Confirm';

    let delete_btn = document.createElement('button');
    delete_btn.setAttribute('class', 'submit-deleteBlog submit');

    delete_btn.appendChild(span);
    delBtnDiv[0].appendChild(delete_btn);

    delete_btn.addEventListener('click', function(){
        submitDeleteBlog();
    })
}

function submitDeleteBlog(){
    document.querySelector('.submit-deleteBlog').classList.toggle('loading');
    window.location.href = '/deleteBlog';
}