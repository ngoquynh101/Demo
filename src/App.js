import TodoList from "./components/TodoList";
import Textfield from "@atlaskit/textfield";
import Button from "@atlaskit/button";
import { useCallback, useEffect, useState } from "react";
// import {v4} from 'uuid'; // Không cần v4 nữa vì backend tự tạo ID
// import { useRef } from "react"; // Không cần useRef cho localStorage nữa

// URL cơ sở của API backend của bạn
const API_BASE_URL = 'http://localhost:3000/todos';

function App() {
  const [todoList, setTodoList] = useState([]);
  const [textInput, setTextInput] = useState("");
  const [loading, setLoading] = useState(true); // Thêm state để quản lý trạng thái tải
  const [error, setError] = useState(null); // Thêm state để quản lý lỗi

  // Hàm để lấy tất cả công việc từ backend
  const fetchTodos = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(API_BASE_URL);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const todos = await response.json();
      // Chuyển đổi cấu trúc dữ liệu từ backend sang format của frontend nếu cần
      // Backend: { id, title, description, completed, created_at }
      // Frontend: { id, name, isCompleted }
      const formattedTodos = todos.map(todo => ({
        id: todo.id,
        name: todo.title, // Map 'title' từ backend sang 'name' của frontend
        isCompleted: todo.completed
      }));
      setTodoList(formattedTodos);
    } catch (err) {
      console.error("Lỗi khi tải danh sách công việc:", err);
      setError("Không thể tải danh sách công việc. Vui lòng thử lại.");
    } finally {
      setLoading(false);
    }
  }, []);

  // useEffect để tải danh sách công việc khi component mount
  useEffect(() => {
    fetchTodos();
  }, [fetchTodos]); // Thêm fetchTodos vào dependency array để đảm bảo useEffect chạy lại nếu fetchTodos thay đổi (dù useCallback đã ổn định nó)

  const onTextInputChange = useCallback((e) => {
    setTextInput(e.target.value);
  }, []);

  // Hàm để thêm công việc mới vào backend
  const onAddBtnClick = useCallback(async () => {
    if (!textInput.trim()) {
      alert("Tiêu đề công việc không được để trống!");
      return;
    }
    try {
      const response = await fetch(API_BASE_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ title: textInput, description: "" }) // Gửi title và description (mô tả có thể trống)
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      // const newTodo = await response.json(); // Có thể nhận lại todo mới từ server nếu cần
      setTextInput(""); // Xóa input sau khi thêm
      fetchTodos(); // Tải lại danh sách công việc để cập nhật UI
    } catch (err) {
      console.error("Lỗi khi thêm công việc:", err);
      alert("Không thể thêm công việc. Vui lòng thử lại.");
    }
  }, [textInput, fetchTodos]);

  // Hàm để cập nhật trạng thái hoàn thành của công việc trên backend
  const onCheckBtnClick = useCallback(async (id) => {
    // Tìm todo trong danh sách hiện tại để lấy trạng thái isCompleted hiện tại
    const todoToUpdate = todoList.find(todo => todo.id === id);
    if (!todoToUpdate) return;

    const newCompletedStatus = !todoToUpdate.isCompleted;

    try {
      const response = await fetch(`${API_BASE_URL}/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ completed: newCompletedStatus }) // Chỉ gửi trường 'completed'
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      // const updatedTodo = await response.json(); // Có thể nhận lại todo đã cập nhật từ server
      fetchTodos(); // Tải lại danh sách công việc để cập nhật UI
    } catch (err) {
      console.error("Lỗi khi cập nhật công việc:", err);
      alert("Không thể cập nhật công việc. Vui lòng thử lại.");
    }
  }, [todoList, fetchTodos]);

  // Hàm để xóa công việc trên backend
  const onDeleteBtnClick = useCallback(async (id) => {
    if (!window.confirm('Bạn có chắc chắn muốn xóa công việc này không?')) {
      return; // Người dùng hủy xóa
    }
    try {
      const response = await fetch(`${API_BASE_URL}/${id}`, {
        method: 'DELETE'
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      console.log(`Công việc với ID ${id} đã được xóa.`);
      fetchTodos(); // Tải lại danh sách công việc để cập nhật UI
    } catch (err) {
      console.error("Lỗi khi xóa công việc:", err);
      alert("Không thể xóa công việc. Vui lòng thử lại.");
    }
  }, [fetchTodos]);

  return (
    <>
      <h3 className="text-2xl font-bold text-center mb-4">
        Danh sách cần làm
      </h3>
      <Textfield
        name="add-todo"
        placeholder="Thêm việc cần làm..."
        elemAfterInput={
          <Button
            isDisabled={!textInput.trim()} // Vô hiệu hóa nếu input rỗng hoặc chỉ chứa khoảng trắng
            appearance="primary"
            onClick={onAddBtnClick}>
            Thêm
          </Button>
        }
        css={{ padding: "2px 4px 2px" }}
        value={textInput}
        onChange={onTextInputChange}
      ></Textfield>

      {loading && <p className="text-center text-blue-500 mt-4">Đang tải công việc...</p>}
      {error && <p className="text-center text-red-500 mt-4">{error}</p>}
      {!loading && !error && (
        <TodoList
          todoList={todoList}
          onCheckBtnClick={onCheckBtnClick}
          onDeleteBtnClick={onDeleteBtnClick} // Truyền prop onDeleteBtnClick xuống TodoList
        />
      )}
    </>
  );
}

export default App;
