import React, { useState, useEffect } from 'react';

import { useAuth } from '../contexts/AuthContext';





const BoardComment = ( { boardId } ) => {
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  



	//
	const { isLoggedIn, serialid } = useAuth();

	
  // 댓글을 가져오는 함수
const fetchComments = async () => {
  try {
    const response = await fetch(`http://49.50.164.251:8000/boardpage/${boardId}/comment`);
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

  // 새로운 댓글을 서버에 보내는 함수
  const postComment = async () => {
    try {
      	    //	
	    if (!isLoggedIn) {
		    // 로그인되어 있지 않으면 댓글 작성 불가능
		    window.alert('로그인이 필요합니다.');
		    return;
	    }
      console.log(serialid);		

	    
      console.log('여기야 여기');
      console.log(boardId);
      await fetch(`http://49.50.164.251:8000/boardpage/${boardId}/comment`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
	      body: JSON.stringify({ comment : newComment, who_write : serialid }),
      });
      // 댓글을 다시 가져와서 업데이트
      console.log('여기야 여기1');
      fetchComments();
      // 입력 필드 초기화
      console.log('여기야 여기2');
      setNewComment('');
    } catch (error) {
      console.error('Error posting comment:', error);
    }
  };

  return (
    <div>
      <h2>댓글</h2>
      <ul>
        {Array.isArray(comments) && comments.map((comment) => (
          <li key={comment.comment2_id}>{comment.username}:{comment.content_com}</li>
        ))}
      </ul>
      <div>
        <textarea
          rows="4"
          cols="50"
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
        />
        <button onClick={postComment}>댓글 작성</button>
      </div>
    </div>
  );
};

export default BoardComment;

