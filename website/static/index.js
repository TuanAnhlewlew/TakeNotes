if ( window.history.replaceState ) {
  window.history.replaceState( null, null, window.location.href );
}


function deleteItem(ele,type,Id) {
  if(type=='note'){
    fetch("/delete-note", {
      method: "POST",
      body: JSON.stringify({ noteId: Id }),
    });
  }
  else if(type=='todo'){
    console.log('delete')
    fetch("/delete-todo", {
      method: "POST",
      body: JSON.stringify({ todoId: Id }),
    });
  }

  delete_item_web(ele)
}


window.addEventListener('DOMContentLoaded', event => {

    // Toggle the side navigation
    const sidebarToggle = document.body.querySelector('#sidebarToggle');
    if (sidebarToggle) {
        sidebarToggle.addEventListener('click', event => {
            event.preventDefault();
            document.body.classList.toggle('sb-sidenav-toggled');
            localStorage.setItem('sb|sidebar-toggle', document.body.classList.contains('sb-sidenav-toggled'));
        });
    }
});

// create new note
function createNote_tab() {
  const body_main=document.querySelector('.body-main-js')
  body_main.innerHTML=`<form method="POST">
                          <input type="hidden" name="type" value="createNote">
                          <input type="text" class="form-control" name="title" id="title" placeholder='Title Here...'>
                          <textarea name="note" rows="18" id="note" class="form-control mt-32" placeholder='Note Here...'></textarea>
                          <br />
                          <div align="center">
                            <button type="submit" class="btn btn-primary">Add Note</button>
                          </div>
                        </form>`
}
function createTodo_tab() {
  const body_main=document.querySelector('.body-main-js')
  body_main.innerHTML=`<form method="POST">
                          <input type="hidden" name="type" value="createTodo">
                          <input type="text" class="form-control" name="title" id="title" placeholder='Title Here...'>
                          <div class="todo-tasks">
                            <div class="input-task d-flex mt-32">
                              <input name="task" class="form-control" placeholder='Task Name Here...'>
                              <button type="button" class="close ml-32" onClick="delete_item_web(this)">
                                <i class="fas fa-times"></i>
                              </button>
                            </div>
                          </div>
                          <div align="center">
                            <button type="button" class="btn btn-outline-secondary mt-32 mb-32" onClick="addTask()"><i class="fas fa-plus"></i></button>
                          </div>
                          <div align="center">
                            <button type="submit" class="btn btn-primary">Save Check-list</button>
                          </div>
                        </form>`
}
function delete_item_web(ele) {
  var x = ele.parentElement;
  x.remove();
}
function addTask(){
  var task=`<div class="input-task d-flex  mt-32">
              <input type="hidden" name="finish" value="false">
              <input name="task" class="form-control" placeholder='Task Name Here...'></input>
              <button type="button" class="close ml-32" onClick="delete_item_web(this)">
                <i class="fas fa-times"></i>
              </button>
            </div>`
  const tasks=document.querySelector('.todo-tasks')
  tasks.insertAdjacentHTML('beforeend',task)
}

function EditTodo_tab(todoid,title,tasks,finish) {
  const body_main=document.querySelector('.body-main-js')
  var edit_section=`<form method="POST">
                      <input type="hidden" name="type" value="EditTodo">
                      <input type="hidden" name="TodoId" value="${todoid}">
                      <input type="text" class="form-control" name="title" id="title" value="${title}"'>
                      <div class="todo-tasks">
                      `
  for(let i = 0;i<tasks.length;i++){
    edit_section+=`     <div class="input-task d-flex mt-32">
                          <input type="hidden" name="finish" value="${finish[i]}">
                          <input name="task" class="form-control" value="${tasks[i]}">
                          <button type="button" class="close ml-32" onClick="delete_item_web(this)">
                            <i class="fas fa-times"></i>
                          </button>
                        </div>
                    `
  }
  edit_section+=    ` </div>
                      <div align="center">
                        <button type="button" class="btn btn-outline-secondary mt-32 mb-32" onClick="addTask()"><i class="fas fa-plus"></i></button>
                      </div>
                      <div align="center">
                        <button type="submit" class="btn btn-primary">Save Changes</button>
                      </div>
                  </form>`
  body_main.innerHTML=edit_section
}

function showNote_tab(id,title,data) {
  const body_main=document.querySelector('.body-main-js')
  body_main.innerHTML=` <button type="button" class="btn btn-outline-secondary btn-sm edit-btn" onClick="showEdit_tab(${id},'${title}',\``.concat(String(data)).concat(`\`)"><i class="far fa-edit"></i> Edit</button>
                        <div class="note-info">
                          <h3 class="note-title text-center">
                            ${title}
                          </h3>
                          <p class="note-data">
                            ${data}
                          </p>
                        </div>`)
}
function showEdit_tab(id,title,data) {
  const body_main=document.querySelector('.body-main-js')
  let data_line=data.replaceAll('<br>','')
  body_main.innerHTML=`<form method="POST">
                          <input type="hidden"  name="type" id="editNote" value="editNote">
                          <input type="hidden"  name="id" id="editNote" value="${id}">
                          <input type="text" class="form-control" name="title_change" id="title" value="${title}">
                          <textarea name="note_change" rows="18" id="note" class="form-control mt-32" >${data_line}</textarea>
                          <br />
                          <div align="center">
                            <button type="submit" class="btn btn-primary">Save Changes</button>
                          </div>
                        </form>`
}

function showTodo_tab(id,title,tasks,taskIds,dones){
  const body_main=document.querySelector('.body-main-js')
  console.log(tasks.join('","'))
  var html=`<button type="button" class="btn btn-outline-secondary btn-sm edit-btn" onClick="EditTodo_tab(${id},'${title}',${"['"+tasks.join("','")+"']"},${"['"+dones.join("','")+"']"})"><i class="far fa-edit"></i> Edit</button>
            <div class="todo-info">
            <h3 class="note-title text-center">
              ${title}
            </h3>
            <div class="task-list">`
              
  for(i=0;i<tasks.length;i++){
    if(dones[i]){
      var check='checked';
      var strike=''
    }
    else{
      var check=''
      var strike='remove'

    }
    var task=tasks[i].replaceAll('\n','<br>')
    html+=` <div class="task-item d-flex">
              <div class="checkbox-wraper">
                <input class="checkbox" type="checkbox" id="todo_${i}" ${check} onClick="changeTask_status(this,${i},${taskIds[i]},${id})">
              </div>
              <div class="task-name position-relative d-inline-block ${strike}">
                <div class="line"></div>
                <label for="todo_${i}" class="task">${task}</label>
              </div>
            </div>`
  }
  html+=`</ul>
        </div>
        </div>`
    body_main.innerHTML=html
}

function changeTask_status(checkbox,taskIndex,taskid,todoid){
  const todo=document.getElementById('todo_'+todoid)
    onclick_attribute=todo.getAttribute('onClick')
    var mySubString = onclick_attribute.substring(
      onclick_attribute.indexOf(",dones=") + 1, 
      onclick_attribute.lastIndexOf(");"));
    list_finish=mySubString.substring(mySubString.indexOf("=")+1)
    list_finish=JSON.parse(list_finish)
  if(checkbox.checked){
    fetch("/changeTask-status", {
      method: "POST",
      body: JSON.stringify({ taskId: taskid, todoId: todoid,finish: true }),
    });
    list_finish[taskIndex]=true
  }
  else{
    fetch("/changeTask-status", {
      method: "POST",
      body: JSON.stringify({ taskId: taskid, todoId:todoid, finish: false }),
    });
    list_finish[taskIndex]=false
  }
  var new_onclick=onclick_attribute.substring(0 , onclick_attribute.indexOf("dones="))+'dones=['+list_finish+']);';
  todo.setAttribute('onClick',new_onclick)
  var label=checkbox.parentNode.nextElementSibling;
  label.classList.toggle("remove")
}



