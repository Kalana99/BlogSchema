let list = document.querySelector('.blog-list');
let blogs = list.querySelectorAll('.one-blog');
let searchBar = document.getElementById('searchTxt');
let isTitle = document.getElementById('filterByTitle').checked;
let isSnippet = document.getElementById('filterBySnippet').checked;

searchBar.addEventListener('keyup', function(event){

    let noList = document.querySelectorAll('.no-blogs');
    if(noList.length > 0){
        for(let i = 0; i < noList.length; i++){
            noList[i].style.display = 'none';
        }
    }
    
    isTitle = document.getElementById('filterByTitle').checked;
    isSnippet = document.getElementById('filterBySnippet').checked;

    let term = event.target.value.toLowerCase();

    let showCount = 0;

    Array.from(blogs).forEach(function(blog){

        let title = blog.getElementsByTagName('h3')[0].innerText;
        let snippet = blog.getElementsByTagName('span')[0].innerText;

        if(isTitle && !isSnippet){
            if(title.toLowerCase().indexOf(term) == -1){
                blog.parentElement.parentElement.style.display = 'none';
            }
            else{
                blog.parentElement.parentElement.style.display = 'block';
                showCount++;
            }
        }
        else if(isSnippet && !isTitle){
            if(snippet.toLowerCase().indexOf(term) == -1){
                blog.parentElement.parentElement.style.display = 'none';
            }
            else{
                blog.parentElement.parentElement.style.display = 'block';
                showCount++;
            }
        }
        else{
            if(title.toLowerCase().indexOf(term) == -1 && snippet.toLowerCase().indexOf(term) == -1){
                blog.parentElement.parentElement.style.display = 'none';
            }
            else{
                blog.parentElement.parentElement.style.display = 'block';
                showCount++;
            }
        }
    });
    if(showCount === 0 && blogs.length !== 0){
        let noBlogDiv = document.createElement('div');
        noBlogDiv.setAttribute('class', 'no-blogs');
        noBlogDiv.innerHTML = '<h3>No blogs to show</h3>';

        list.appendChild(noBlogDiv);
    }
});