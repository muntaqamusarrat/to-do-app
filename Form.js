import React from "react"

export default function Form() {
    //STATES
    const [formData, setFormData] = React.useState("")
    const [toDoList, setToDoList] = React.useState(() => { //toDoListr array
        const listItems = localStorage.getItem('items')
        const toDoList = JSON.parse(listItems)
        return toDoList || []
    })
    const [toDoEdit, setToDoEdit] = React.useState(null) //id
    const [showSeparator, setShowSeparator] = React.useState(false);
    const [submitToggle, setSubmitToggle] = React.useState(true) //submit button or save button
    
    //FUNCTIONS
    //setFormData
    function handleFormData(event) {
        // console.log(event.target.value)
        setFormData((prev) => {
            //console.log(prev, event.target.value);
            return (event.target.value)
        })
    }

    //submit button func
    function handleSubmit(event){
        //event.preventDefault()
        //console.log(event)
        //empty
        if (!formData) {
            alert("please fill out the field")
        }
        //edit
        else if(formData && !submitToggle) {
            setToDoList( //update toDoList
                toDoList.map((todo) => {
                    if(todo.id === toDoEdit) {
                        return {
                            ...todo,
                            text: formData
        
                        }
                    }
                    return todo
                })
            )
            setSubmitToggle(true)
            setFormData("")
            setToDoEdit(null)
        }
        //new entry
        else{
            const allInputData = {
                id: new Date().getTime(), 
                text: formData, 
                checked: false
            }
            setToDoList([...toDoList, allInputData])
            setFormData('')
        }
    } 

    //enter button func
    function handleKeyDown(event) {
        if (event.key === 'Enter') {
            handleSubmit()
        }
    }  
    //del button func
    function handleDelete(id){
        const updatedToDo = [...toDoList].filter((todo) => todo.id !== id)
        setToDoList(updatedToDo)
    }

    //checkbox function
    function handleToggle(id) {
        const updatedToDo = toDoList.map((todo) => {
            if (todo.id === id) {
                todo.checked = !todo.checked
            }
            return todo
        })
        setToDoList(updatedToDo)
    }
    
    //edit button func
    function handleEdit(id) {
        const updatedToDo = toDoList.find((todo) => {
            return todo.id === id
        })  
        //console.log(updatedToDo)   
        setSubmitToggle(false)
        setFormData(updatedToDo.text)
        setToDoEdit(id)
    }
    
    //USE EFFECTS
    React.useEffect(() => {
        localStorage.setItem('items', JSON.stringify(toDoList))
    }, [toDoList])

    //Draw a line under the unchecked todos to separate the checked and unchecked todos.
    React.useEffect(() => {
    //hasCheckedTodo contains checked todo
     const hasCheckedTodo = toDoList.some((todo) => todo.checked);//filter out only checked ones
     setShowSeparator(hasCheckedTodo) //true
    }, [toDoList]);    
    
    return (
        <div className="main-div">
          <div className="child-div">
            {/*1st input field*/}
            <h1>TO DO ITEMS</h1>
            <div className="add-items-div">
                <label>
                Enter To Do Item
                <input
                    type="text"
                    placeholder="Add a New Item"
                    value={formData}
                    name="item"
                    onChange={handleFormData}
                    onKeyDown={handleKeyDown}
                />
                </label>
                {
                    submitToggle ? 
                    (<button className="add-btn" title="add Item" onClick={handleSubmit}>Submit</button>) 
                    : 
                    (<button className="add-btn" title="update Item" onClick={handleSubmit}>Save</button>)
                }
            </div>
          </div>

          {/*mapping the array*/}
          {/*shows unchecked items above separator*/}
          {toDoList.filter(
            (todo) => !todo.checked
          ).map((todo) => (
            <div key={todo.id}>
             <div className="cbChecked" style={{textDecoration:todo.checked ? "line-through" : "none" }}>
              <div className="checkbox">
                {todo.text} 
                <input className="checkIn"
                    type="checkbox"
                    onChange={() => handleToggle(todo.id)}
                    checked={todo.checked}
                />
                <button className="edit-btn" onClick={() => handleEdit(todo.id)}>Edit</button>
                <button className="delete-btn" onClick={() => handleDelete(todo.id)}>Delete</button>
                </div>
              </div>
            </div>
          ))}
          {showSeparator &&  
            (<hr className ="separator"/>)
          }
          {/*shows checked items below separator*/}
          {toDoList.filter(
            (todo) => todo.checked
          ).map((todo) => (
            <div key={todo.id}>
             <div className="cbChecked" style={{textDecoration:todo.checked ? "line-through" : "none" }}>
              <div className="checkbox">
                {todo.text} 
                <input className="checkIn"
                    type="checkbox"
                    onChange={() => handleToggle(todo.id)}
                    checked={todo.checked}
                />
                <button className="edit-btn" onClick={() => handleEdit(todo.id)}>Edit</button>
                <button className="delete-btn" onClick={() => handleDelete(todo.id)}>Delete</button>
                </div>
              </div>
            </div>
          ))}
         
        </div>
      );
    }