window.onload = () => {
    const db = firebase.firestore();
    const db_collection = db.collection("todoapp").doc("b7uXH3ZXfJyP2JupaJuC");
    const todoForm = document.getElementById('todo-form');    
    const mainContent = document.querySelector('.main-content');    
    const arrTodo = [];
    //load task
    const mainContentArr = Array.from(mainContent.children);
    if (todoForm && mainContentArr.length === 0) {
        db_collection.get()
        .then((doc) => {
            if (doc.exists) {
                const arr = doc.data().todo;
                arr.forEach(element => {
                    let loadContent = element.content;
                    arrTodo.push(element);
                    const loadTodo = createNewTodo(loadContent);    
                    mainContent.appendChild(loadTodo);
                });
                if (mainContent) {
                    const mainContentList = Array.from(mainContent.children);
                    arr.forEach((element, index) => {
                        if (element.done === true) {
                            mainContentList[index].children[0].classList.add('done-task');
                        }
                    });
                }
            } else {
                // doc.data() will be undefined in this case
                console.log("No such document!");
            }
        })
        .catch((error) => {
            console.log("Error getting document:", error);
        });
    }
    
    //Add task to list
    if (todoForm) {
        todoForm.addEventListener('submit', (event) => {
            event.preventDefault();                
            const todoElement = todoForm.list.value;
            const blankTextRegex = /^\s*$/;
            if (mainContent && todoElement && !blankTextRegex.test(todoElement)) {
                const element = createNewTodo(todoElement);  
                db_collection.update({
                    todo: firebase.firestore.FieldValue.arrayUnion({
                        content: todoElement,
                        createdAt: new Date(),
                        done: false
                    })
                });                                   
                console.log('add todo');              
                mainContent.appendChild(element);
            }            
            todoForm.list.value = '';
        })
    }

    if (mainContent) {                
        mainContent.addEventListener('click', (event) => {
            //Finish Task
            if (event.target.classList.contains('main-text')) {
                const doneContent = event.target.textContent;
                arrTodo.forEach((element, index) => {
                    if (element.content.toLowerCase() === doneContent.toLowerCase()) {
                        if (element.done === false) {
                            event.target.classList.add('done-task');
                            element.done = true;
                        }else{
                            event.target.classList.remove('done-task');
                            element.done = false;
                        }
                    }
                });
                db_collection.update({todo: arrTodo});                
            }
            //Delete Task
            if (event.target.parentElement.classList.contains('delete-btn')) {
                const deleteContent = event.target.parentElement.parentElement.textContent;
                arrTodo.forEach((element, index) => {
                    if (element.content.toLowerCase() === deleteContent.toLowerCase()) {
                        arrTodo.splice(index, 1);
                    }
                });
                db_collection.update({todo: arrTodo});
                event.target.parentElement.parentElement.remove();                
            }
        })
    }

    //Reusable functions

    //create component
    const createComponent = (el, cl) => {
        const element = document.createElement(el);
        if (element) {
            element.classList.add(cl);
        }
        return element;
    }
    //first letter touppercase
    const firstLetterToUpperCase = (str) => {
        if (str) {         
            let newArr = str.split('');
            let newStr = '';    
            newArr[0] = newArr[0].toUpperCase();
            newArr.forEach(element => {
                newStr += element;
            });
            return newStr;   
        }
    }   
    //create new todo
    const createNewTodo = (text) => {
        const element = createComponent('div', 'element');
        const mainText = createComponent('div', 'main-text');
        const deleteBtn = createComponent('div', 'delete-btn');
        deleteBtn.innerHTML = '<ion-icon name="trash"></ion-icon>';
        element.appendChild(mainText);
        element.appendChild(deleteBtn);
        mainText.innerText = firstLetterToUpperCase(text);        
        return element;
    }
}