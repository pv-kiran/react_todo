import React, { useEffect, useState } from 'react'
import '../App.css'
import Alert from './Alert';
import List from './List'
import { FaTrashAlt } from "react-icons/fa";


const getLocalTodoList = () => {
    const localTodos = localStorage.getItem('todos')
    console.log(localTodos);
    if(localTodos) {
        return JSON.parse(localTodos);
    } else {
        return [];
    }
}

function Todo() {

  const [todo, setTodo] = useState({item: '' , isDone: false});
  const [todoList, setTodoList] = useState(getLocalTodoList);
  const [isEdit, setIsEdit] = useState(false)
  const [editId, setEditId] = useState(null);
  const [alert, setAlert] = useState({show: false , msg: '' , type: ''});
  

  useEffect(() => {
    localStorage.setItem('todos' , JSON.stringify(todoList));
  }, [todoList])
  



  const handleChange = (e) => {
    const name = e.target.name ;
    const value = e.target.value ;
    setTodo((todo) => {
        return {...todo , [name]: value}
    })
  }

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(typeof todo.item);
    if(todo.item === '') {
        console.log(true);
        showAlert(true , 'Add a todo' , 'danger')
    }
    else if(todo && isEdit ) {
        showAlert(true , 'Item edited' , 'success')
       const updatedTodos = todoList.map((item) => {
           if(item.id === editId) {
               item.item = todo.item ;
               return item ;
           } else {
            return item ;
           }
       })
       setTodoList(updatedTodos);
       setTodo({item:'' , isDone: false});
       setEditId(null);
       setIsEdit(false);
    }
    else {
        const newItem = {
            id: new Date().getMilliseconds() ,
            item: todo.item ,
            isDone: todo.isDone
        }
        setTodoList((todos) => {
            return [...todos , newItem];
        })
        setTodo({...todo , item: ''});
        showAlert(true , 'item added' , 'success')
    }
  }

  const removeTodo = (id) => {
   setTodoList((todos) => {
        return todos.filter(todo => todo.id != id)
   })
   showAlert(true , "Item removed" , 'danger')
   if(isEdit) {
     setIsEdit(false);
     setTodo({item:'' , isDone: false})
   }
  }

  const changeTodoStatus = (id) => {
    
    const updatedTodoList = todoList.map((todo) => {
        if(todo.id === id) {
            todo.isDone = !todo.isDone
            return todo ;
        } else {
            return todo
        }
    })
    
    setTodoList(updatedTodoList);
    console.log(todoList);



    // setTodoList((todoList) => {
    //     return todoList.map((todo) => {
    //         if(todo.id === id) {
    //             todo.isDone = !todo.isDone
    //             // return todo;
    //             console.log(todo);
    //         }
    //         return todo;
    //     })
    // })



  }

  const editTodo = (id) => {
    setEditId(id);
    setIsEdit(true);
    const todo = todoList.find((item) => item.id === id)
    setTodo(todo);
  }

  const clearAll  = () => {
     setTodoList([]);
     showAlert(true , "Items deleted" , 'danger')
     if(isEdit) {
        setIsEdit(false);
        setTodo({item:'' , isDone: false})
     }
  }
 

  const showAlert = (show = false , msg = '' , type = '') => {
      setAlert({show , msg , type})
  }

  return (
    <React.Fragment>
      <section className="todo-container">
        {
            alert.show && <Alert {...alert} todoList = {todoList} removeAlert = {showAlert}></Alert>
        }
        <div className="form-container">
            <form onSubmit={handleSubmit}>
                <div className="input-control">
                    <input type="text" name="item" id="todo" 
                    value={todo.item}
                    onChange= {(e) => handleChange(e)}
                    />
                </div>
                <button className='btn-submit' type='submit'>
                    {
                        isEdit ? 'EDIT' : 'ADD'
                    }
                </button>
            </form>
        </div>
        <ul className='list'> 
            <List 
               items = {todoList} 
               removeTodo = {removeTodo} 
               changeTodoStatus = {changeTodoStatus}
               editTodo = {editTodo}
            >
            </List>
        </ul>
        {
            todoList.length > 0 && <FaTrashAlt className='btn-clear' onClick={() => clearAll()}></FaTrashAlt>
        }
      </section>
        
    </React.Fragment>
  )
}

export default Todo