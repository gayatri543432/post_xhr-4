
const cl=console.log;

const postForm=document.getElementById('postForm')
const titleControl=document.getElementById('title')
const bodyControl=document.getElementById('body')
const postIDControl=document.getElementById('userId')
const addBtn=document.getElementById('addBtn')
const updateBtn=document.getElementById('updateBtn')
const postContainer=document.getElementById('postContainer')
const spinner=document.getElementById('spinner')

let BASE_URL=`https://jsonplaceholder.typicode.com/`
let POST_URL=`https://jsonplaceholder.typicode.com/posts`

let postArr=[]

function snackBar(msg,i){
    Swal.fire({
        title:msg,
        icon:i,
        timer:3000
    })
}

function toolTips(){

  $('[data-toggle="tooltip"]').tooltip()

}

function cerateCards(arr){
    let res=''
    arr.forEach(p => {
        res+=` <div class="col-md-4 mt-5 " id="${p.id}">
                <div class="card h-100">
                    <div class="card-header" data-toggle="tooltip" data-placement="top" title="${p.title}">
                        <h3>${p.title}</h3>
                    </div>
                    <div class="card-body">
                        <p>${p.body}</p>
                    </div>
                    <div class="card-footer d-flex justify-content-between">
                        <i onclick="onEdit(this)" class="fa-solid fa-pen-to-square fa-2x text-primary"
                        data-toggle="tooltip" data-placement="top" title="Edit Post"></i>
                        <i onclick="onRemove(this)" class="fa-solid fa-trash-can fa-2x text-danger"
                        data-toggle="tooltip" data-placement="top" title="Delete Post"></i>
                    </div>
                </div>
            </div>`
    });
    postContainer.innerHTML=res
    toolTips()
}


function fetchPosts(){
    
    let xhr=new XMLHttpRequest()
    xhr.open('GET',POST_URL);
    xhr.send(null);
    xhr.onload=function(){
        if(xhr.status>=200 && xhr.status<=299){
            let res=JSON.parse(xhr.response);
            postArr=res
            cerateCards(res.reverse())
            
        }else{
            
            snackBar('something went wrong..','error')
        }
    }
}
fetchPosts()
function onSubmitPost(ele){
    spinner.classList.remove('d-none')
    ele.preventDefault()
    let new_post={
        title:titleControl.value,
        body:bodyControl.value,
        userId: postIDControl.value
    }
    let xhr=new XMLHttpRequest()
    xhr.open('POST',POST_URL)
    xhr.setRequestHeader('Content-Type', 'application/json; charset=UTF-8');
    xhr.send(JSON.stringify(new_post))
     xhr.onload = function () {

        if (xhr.status >= 200 && xhr.status < 300) {

            let res = JSON.parse(xhr.response);

            let col=document.createElement('div')
            col.className='col-md-4 mt-5'
            col.id=res.id
            col.innerHTML=` <div class="card h-100">
                    <div class="card-header" data-toggle="tooltip" data-placement="top" title="${new_post.title}">
                        <h3>${new_post.title}</h3>
                    </div>
                    <div class="card-body">
                        <p>${new_post.body}</p>
                    </div>
                    <div class="card-footer d-flex justify-content-between">
                        <i onclick="onEdit(this)" class="fa-solid fa-pen-to-square fa-2x text-primary"
                         data-toggle="tooltip" data-placement="top" title="Edit Post"></i>
                        <i onclick="onRemove(this)" class="fa-solid fa-trash-can fa-2x text-danger"
                         data-toggle="tooltip" data-placement="top" title="Delete Post"></i>
                    </div>
                </div>`
            postContainer.prepend(col)
            postForm.reset()
            spinner.classList.add('d-none')
            toolTips()
            snackBar(`Post ${res.id} Added Successfully`, 'success');

        } else {
            spinner.classList.add('d-none')
            snackBar('Something went wrong', 'error');
        }
    }
}

function onRemove(ele){
    
    let REMOVE_ID=ele.closest('.col-md-4').id
    Swal.fire({
  title: "Are you sure?",
  text: "You won't be able to revert this!",
  icon: "warning",
  showCancelButton: true,
  confirmButtonColor: "#3085d6",
  cancelButtonColor: "#d33",
  confirmButtonText: "Yes, delete it!"
}).then((result) => {
  if (result.isConfirmed) {
    spinner.classList.remove('d-none')
    let REMOVE_URL=`${POST_URL}/${REMOVE_ID}`
    let xhr=new XMLHttpRequest()
    xhr.open('DELETE',REMOVE_URL)
    xhr.send(null)
    xhr.onload=function(){
         if (xhr.status >= 200 && xhr.status < 300) {
            document.getElementById(REMOVE_ID).remove()
            spinner.classList.add('d-none')
            snackBar( `Post id ${REMOVE_ID} Deleted Successfully`, 'success');

         }else{
            spinner.classList.add('d-none')
            snackBar('Something went wrong', 'error');

         }
            
    }
  }
});
}

function onEdit(ele){
    spinner.classList.remove('d-none')
    let EDIT_ID=ele.closest(".col-md-4").id
    // cl(EDIT_ID)
    localStorage.setItem('EDIT_ID',EDIT_ID)
    
    let EDIT_URL=`${BASE_URL}/posts/${EDIT_ID}`
    let xhr=new XMLHttpRequest()
    xhr.open('GET',EDIT_URL)
    xhr.send(null)
    xhr.onload=function(){
        if(xhr.status>=200 && xhr.status<=299){
            let res=JSON.parse(xhr.response)
            titleControl.value=res.title;
            bodyControl.value=res.body;
            postIDControl.value=res.userId
        }

        postForm.scrollIntoView({
            behavior:'smooth',
            block:'center'
        })
        addBtn.classList.add('d-none')
        updateBtn.classList.remove('d-none')
        spinner.classList.add('d-none')
    }
}
function onPostUpdate(){
    spinner.classList.remove('d-none')
    let UPDATE_ID=localStorage.getItem('EDIT_ID')
    let UPDATE_URL=`${POST_URL}/${UPDATE_ID}`
    let updated_obj={
        title:titleControl.value,
        body:bodyControl.value,
        userId: postIDControl.value,

    }
    let xhr=new XMLHttpRequest()
    xhr.open('PATCH',UPDATE_URL)
    xhr.setRequestHeader('Content-Type', 'application/json; charset=UTF-8');
    xhr.send(JSON.stringify(updated_obj));
    xhr.onload=function(){
        if(xhr.status>=200 && xhr.status<=299){
            let res=JSON.parse(xhr.response)
            let card=document.getElementById(UPDATE_ID)
            card.querySelector('.card-header h3').innerHTML=res.title;
            card.querySelector('.card-body p').innerHTML=res.body;
            let header = card.querySelector('.card-header');

            header.setAttribute('title', res.title);

            $(header).tooltip('dispose');

            $(header).tooltip();
            addBtn.classList.remove('d-none')
             updateBtn.classList.add('d-none')

            let updatedPost=document.getElementById(UPDATE_ID);
            updatedPost.classList.add('bg')

            updatedPost.scrollIntoView({
                behavior:'smooth',
                block:'center'
            })

            setTimeout(() => {
                updatedPost.classList.remove('bg')
                
            }, 3000);
            postForm.reset()
            spinner.classList.add('d-none')

            snackBar(`The Post ${UPDATE_ID} updated Successfully`,'success')
        }else{
            spinner.classList.add('d-none')
            snackBar('Something went wrong', 'error');

        }
    }

}
postForm.addEventListener('submit',onSubmitPost)
updateBtn.addEventListener('click',onPostUpdate)

