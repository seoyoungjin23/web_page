

import React, { useState, useEffect } from 'react';

import { useAuth } from '../contexts/AuthContext';





const BoardDragComment = ({ boardId }) => {
    const [dragcomments, setdargComments] = useState([]);
    




    //
    const { isLoggedIn, serialid } = useAuth();


    // 댓글을 가져오는 함수
    const fetchComments = async () => {
        try {
            const response = await fetch(`http://49.50.164.251:8000/boardpage/${boardId}/dragcomment`);
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            if (response.status === 204) {
                // 204 No Content 응답이면 빈 배열로 설정
                setComments([]);
            } else {
                // JSON 데이터가 있는 경우 파싱하고 상태 업데이트
                const data = await response.json();
                setComments(data);
            }
        } catch (error) {
            console.error('Error fetching comments:', error);
        }
    };
    // 컴포넌트가 마운트될 때 댓글을 가져오도록 설정
    useEffect(() => {
        fetchComments();
    }, [boardId]);



    return (
        <div>
            <h2>댓글</h2>
            <ul>
                {Array.isArray(dragcomments) && dragcomments.map((dragcomment) => (
                    <li key={dargcomment.comment2_id}>{dragcomment.username}:{dragcomment.content_com}</li>
                ))}
            </ul>

        </div>
    );
};

export default BoardDragComment;

