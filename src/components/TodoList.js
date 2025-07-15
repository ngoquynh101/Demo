import React from 'react';
import Todo from './Todo'; // Đảm bảo đường dẫn này đúng

// TodoList component nhận thêm prop onDeleteBtnClick
export default function TodoList({ todoList, onCheckBtnClick, onDeleteBtnClick }) {
  return (
    <div className="mt-4"> {/* Thêm một div bọc để dễ dàng thêm margin/padding */}
      {/* Kiểm tra nếu danh sách rỗng để hiển thị thông báo */}
      {todoList.length === 0 ? (
        <p className="text-center text-gray-500">Chưa có công việc nào. Hãy thêm một công việc mới!</p>
      ) : (
        // Map qua danh sách công việc và render từng Todo item
        // Truyền tất cả các props cần thiết xuống component Todo
        todoList.map((todo) => (
          <Todo
            key={todo.id}
            todo={todo}
            onCheckBtnClick={onCheckBtnClick}
            onDeleteBtnClick={onDeleteBtnClick} // Truyền prop onDeleteBtnClick xuống đây
          />
        ))
      )}
    </div>
  );
}
