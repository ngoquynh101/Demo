import TodoList from "./components/TodoList";
import Textfield from "@atlaskit/textfield";
import Button from "@atlaskit/button";
import { useCallback, useEffect, useState } from "react";
import {v4} from 'uuid';
import { useRef } from "react";
const TODO_APP_STORAGE_KEY = 'TODO_APP';



function App() {
  const[todoList, setTodoList]=useState([]);
  const[textInput, setTextInput]=useState("");
  const isMounted = useRef(false);

useEffect(()=>{
  const storagedTodoList = localStorage.getItem(TODO_APP_STORAGE_KEY);
  if(storagedTodoList){
    setTodoList(JSON.parse(storagedTodoList));
  }
},[]);
useEffect(() => {
  if (isMounted.current) {
    localStorage.setItem(TODO_APP_STORAGE_KEY, JSON.stringify(todoList));
  } else {
    isMounted.current = true;
  }
}, [todoList]);

/*useEffect(()=> {
  localStorage.setItem(TODO_APP_STORAGE_KEY, JSON.stringify(todoList));
},[todoList]);*/

  const onTextInputChange = useCallback((e) =>{
    setTextInput(e.target.value);
  }, []);
  const onAddBtnClick=useCallback(() => {
    //them text input vaoo danh sach todoList
    setTodoList((prevTodoList)=>[{ id:v4(), name: textInput, isCompleted: false },
      ...prevTodoList,
    ]);
    setTextInput("");
  }, 
  [textInput]);
const onCheckBtnClick=useCallback((id)=>{
  setTodoList((prevState)=>prevState.map((todo) =>
  todo.id===id? {...todo, isCompleted: !todo.isCompleted} : todo))
},[]);

  return (
    <>
    <h3>
      Danh sách cần làm
    </h3>
    <Textfield 
      name="add-todo" placeholder="Thêm việc cần làm..." 
      elemAfterInput={
        <Button 
        isDisabled={!textInput} 
        appearance="primary" 
        onClick={onAddBtnClick}> 
        Thêm 
      </Button>
      }
      css={{padding: "2px 4px 2px"}}
      value={textInput}
      onChange={onTextInputChange}
      ></Textfield>
      <TodoList todoList={todoList} onCheckBtnClick={onCheckBtnClick}/>
    </>
  );
}

export default App;
