import React from 'react';
import Button from '@atlaskit/button';
import styled from 'styled-components';
import CheckIcon from '@atlaskit/icon/glyph/check';
import CrossIcon from '@atlaskit/icon/glyph/cross'; // Import icon dấu X cho nút xóa

// Styled component cho nút chính của công việc (tiêu đề và checkmark)
const ButtonStyled = styled(Button)`
    margin-top: 5px;
    text-align: left;
    flex-grow: 1; /* Cho phép nút này mở rộng để chiếm không gian còn lại */
    padding: 8px 12px; /* Thêm padding để nút trông đẹp hơn */
    border-radius: 6px; /* Bo tròn góc */
    box-shadow: 0 1px 3px rgba(0,0,0,0.1); /* Thêm đổ bóng nhẹ */

    &, &:hover {
        ${p => p.isCompleted && `
            text-decoration: line-through;
            color: #888; /* Màu xám cho văn bản đã hoàn thành */
        `}
    }

    &:hover {
        .check-icon {
            display: inline-block; /* Hiển thị icon check khi hover */
        }
    }

    .check-icon {
        display: none; /* Mặc định ẩn icon check */
        /* Thêm một chút padding và bo tròn cho icon check để nó trông như một nút nhỏ */
        padding: 2px;
        border-radius: 3px;
        &:hover {
            background-color: #e2e2e2;
        }
    }
`;

// Component Todo nhận thêm prop onDeleteBtnClick
export default function Todo({ todo, onCheckBtnClick, onDeleteBtnClick }) {
    // Xử lý trường hợp prop todo không hợp lệ để tránh lỗi runtime
    if (!todo || typeof todo.name === 'undefined') {
        return null;
    }

    return (
        // Bọc toàn bộ item trong một thẻ <li> để phù hợp với cấu trúc danh sách
        <li className={`flex items-center justify-between p-3 mb-2 rounded-lg shadow-md ${
            todo.isCompleted ? 'bg-green-100' : 'bg-white'
        }`}>
            {/* Nút chính cho tiêu đề công việc và checkmark */}
            <ButtonStyled
                isCompleted={todo.isCompleted}
                shouldFitContainer={false} // Không cho nó tự động chiếm toàn bộ chiều rộng
                // Khi click vào ButtonStyled, sẽ gọi hàm onCheckBtnClick để chuyển đổi trạng thái
                onClick={() => onCheckBtnClick(todo.id)}
                iconAfter={!todo.isCompleted && ( // Chỉ hiển thị icon check nếu công việc chưa hoàn thành
                    <span
                        className='check-icon'
                        // Không cần onClick ở đây nữa, vì click vào ButtonStyled đã xử lý
                        // Icon này chỉ là một phần của ButtonStyled
                    >
                        <CheckIcon primaryColor='#4fff4f' />
                    </span>
                )}
            >
                {/* Hiển thị tên công việc */}
                {todo.name}
            </ButtonStyled>

            {/* Nút Xóa */}
            <Button
                appearance="danger" // Sử dụng kiểu "danger" cho nút xóa (màu đỏ)
                onClick={() => onDeleteBtnClick(todo.id)} // Gắn sự kiện xóa
                iconBefore={<CrossIcon primaryColor='white' />} // Thêm icon dấu X màu trắng
                className="ml-2" // Thêm margin-left để tách biệt với nút công việc
                // Có thể thêm text "Xóa" nếu muốn, hoặc chỉ dùng icon
                // Ví dụ: <Button ...>Xóa</Button>
            >
                {/* Để trống nếu chỉ muốn hiển thị icon */}
            </Button>
        </li>
    );
}
