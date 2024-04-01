import React, { useState, useEffect } from 'react';
import { AiOutlineDelete, AiOutlineEdit } from 'react-icons/ai';
import { BsCheckLg } from 'react-icons/bs';

interface Todo {
  title: string;
  description: string;
  completedOn?: string;
}

export default function Home(): JSX.Element {
  const [isCompleteScreen, setIsCompleteScreen] = useState<boolean>(false);
  const [allTodos, setTodos] = useState<Todo[]>([]);
  const [newTitle, setNewTitle] = useState<string>('');
  const [newDescription, setNewDescription] = useState<string>('');
  const [completedTodos, setCompletedTodos] = useState<Todo[]>([]);
  const [currentEdit, setCurrentEdit] = useState<number | null>(null);
  const [currentEditedItem, setCurrentEditedItem] = useState<Todo | null>(null);

  const handleAddTodo = (): void => {
    const newTodoItem: Todo = {
      title: newTitle,
      description: newDescription,
    };

    const updatedTodoArr: Todo[] = [...allTodos, newTodoItem];
    setTodos(updatedTodoArr);
    localStorage.setItem('todolist', JSON.stringify(updatedTodoArr));
  };

  const handleDeleteTodo = (index: number): void => {
    const reducedTodo: Todo[] = [...allTodos.slice(0, index), ...allTodos.slice(index + 1)];
    localStorage.setItem('todolist', JSON.stringify(reducedTodo));
    setTodos(reducedTodo);
  };

  const handleComplete = (index: number): void => {
    const now: Date = new Date();
    const completedOn: string = `${now.getDate()}-${now.getMonth() + 1}-${now.getFullYear()} at ${now.getHours()}:${now.getMinutes()}:${now.getSeconds()}`;

    const filteredItem: Todo = {
      ...allTodos[index],
      completedOn: completedOn,
    };

    const updatedCompletedArr: Todo[] = [...completedTodos, filteredItem];
    setCompletedTodos(updatedCompletedArr);
    handleDeleteTodo(index);
    localStorage.setItem('completedTodos', JSON.stringify(updatedCompletedArr));
  };

  const handleDeleteCompletedTodo = (index: number): void => {
    const reducedTodo: Todo[] = [...completedTodos.slice(0, index), ...completedTodos.slice(index + 1)];
    localStorage.setItem('completedTodos', JSON.stringify(reducedTodo));
    setCompletedTodos(reducedTodo);
  };

  useEffect(() => {
    const savedTodo: Todo[] | null = JSON.parse(localStorage.getItem('todolist') || 'null');
    const savedCompletedTodo: Todo[] | null = JSON.parse(localStorage.getItem('completedTodos') || 'null');

    if (savedTodo) {
      setTodos(savedTodo);
    }

    if (savedCompletedTodo) {
      setCompletedTodos(savedCompletedTodo);
    }
  }, []);

  const handleEdit = (ind: number, item: Todo): void => {
    setCurrentEdit(ind);
    setCurrentEditedItem(item);
  };

  const handleUpdateTitle = (value: string): void => {
    if (currentEditedItem) {
      setCurrentEditedItem(prev => ({ ...prev!, title: value }));
    }
  };

  const handleUpdateDescription = (value: string): void => {
    if (currentEditedItem) {
      setCurrentEditedItem(prev => ({ ...prev!, description: value }));
    }
  };

  const handleUpdateToDo = (): void => {
    if (currentEdit !== null && currentEditedItem) {
      const newToDo: Todo[] = [...allTodos];
      newToDo[currentEdit] = currentEditedItem;
      setTodos(newToDo);
      setCurrentEdit(null);
    }
  };

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <div className="App">
        <h1>My Todos</h1>
        <div className="todo-wrapper">
          <div className="todo-input">
            <div className="todo-input-item">
              <label>Title</label>
              <input
                type="text"
                value={newTitle}
                onChange={e => setNewTitle(e.target.value)}
                placeholder="What's the task title?"
              />
            </div>
            <div className="todo-input-item">
              <label>Description</label>
              <input
                type="text"
                value={newDescription}
                onChange={e => setNewDescription(e.target.value)}
                placeholder="What's the task description?"
              />
            </div>
            <div className="todo-input-item">
              <button
                type="button"
                onClick={handleAddTodo}
                className="primaryBtn"
              >
                Add
              </button>
            </div>
          </div>
          <div className="btn-area">
            <button
              className={`secondaryBtn ${!isCompleteScreen && 'active'}`}
              onClick={() => setIsCompleteScreen(false)}
            >
              Todo
            </button>
            <button
              className={`secondaryBtn ${isCompleteScreen && 'active'}`}
              onClick={() => setIsCompleteScreen(true)}
            >
              Completed
            </button>
          </div>
          <div className="todo-list">
            {isCompleteScreen === false &&
              allTodos.map((item, index) => {
                if (currentEdit === index) {
                  return (
                    <div className='edit__wrapper' key={index}>
                      <input
                        placeholder='Updated Title'
                        onChange={(e) => handleUpdateTitle(e.target.value)}
                        value={currentEditedItem ? currentEditedItem.title : ''}
                      />
                      <textarea
                        placeholder='Updated Title'
                        rows={4}
                        onChange={(e) => handleUpdateDescription(e.target.value)}
                        value={currentEditedItem ? currentEditedItem.description : ''}
                      />
                      <button
                        type="button"
                        onClick={handleUpdateToDo}
                        className="primaryBtn"
                      >
                        Update
                      </button>
                    </div>
                  );
                } else {
                  return (
                    <div className="todo-list-item" key={index}>
                      <div>
                        <h3>{item.title}</h3>
                        <p>{item.description}</p>
                      </div>
                      <div>
                        <AiOutlineDelete
                          className="icon"
                          onClick={() => handleDeleteTodo(index)}
                          title="Delete?"
                        />
                        <BsCheckLg
                          className="check-icon"
                          onClick={() => handleComplete(index)}
                          title="Complete?"
                        />
                        <AiOutlineEdit
                          className="check-icon"
                          onClick={() => handleEdit(index, item)}
                          title="Edit?"
                        />
                      </div>
                    </div>
                  );
                }
              })}
            {isCompleteScreen === true &&
              completedTodos.map((item, index) => {
                return (
                  <div className="todo-list-item" key={index}>
                    <div>
                      <h3>{item.title}</h3>
                      <p>{item.description}</p>
                      <p><small>Completed on: {item.completedOn}</small></p>
                    </div>
                    <div>
                      <AiOutlineDelete
                        className="icon"
                        onClick={() => handleDeleteCompletedTodo(index)}
                        title="Delete?"
                      />
                    </div>
                  </div>
                );
              })}
          </div>
        </div>
      </div>
    </main>
  );
}