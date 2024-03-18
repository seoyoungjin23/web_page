import React from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Link, useNavigate } from 'react-router-dom';


const BoardDeleteButton = ({ boardId }) => {
    const { isLoggedIn, setLoginRedirectPath, userName, serialid, verifyToken } = useAuth();
    const navigate = useNavigate();

    const handleDelete = async (e) => {

        await verifyToken();
        if (!isLoggedIn) {
            e.preventDefault();
            // If not logged in, navigate to the signin page
            alert('게시글 삭제는 로그인 후 이용하실 수 있습니다.');
            setLoginRedirectPath('/boardpage/' + boardId); // 리디렉트 경로 설정
            navigate('/signin');
        }
        else {
            try {
                const response = await fetch(`http://49.50.164.251:8000/boardpage/${boardId}/verify`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        serial_id: serialid,
                    }),

                });

                if (response.ok) {
                    const data = await response.json();
                    try {
                        await fetch(`http://49.50.164.251:8000/boardpage/${boardId}`, {
                            method: 'DELETE',
                            headers: {
                                'Content-Type': 'application/json',
                            },
                            body: JSON.stringify({
                                confirmation: 'confirm',
                            }),
                        });

                        console.log(`Board ${boardId} deleted`);
                        // 히스토리상 바로 전 페이지로 이동 / 지정해서 가는 navigate() 와 다름
                        window.history.back()
                    } catch (error) {
                        console.error('Error deleting board:', error);
                    }

                }


            } catch (error) {
                console.error('Error liking board:', error);
            }
        }

    };

    return (
        <span style={{ cursor: 'pointer', color: 'blue', textDecoration: 'underline' }} onClick={handleDelete}>
            삭제하기
        </span>
    );
};
export default BoardDeleteButton;
