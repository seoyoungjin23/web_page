import React, { useState, useEffect } from 'react';
import { useParams, Link , useNavigate } from 'react-router-dom';
import BoardDeleteButton from '../components/BoardDeleteButton'; // Adjust the path accordingly
import BoardComment from '../components/BoardComment';
import BoardDragComment from '../components/BoardDragComment';
import styled from 'styled-components';
import { useAuth } from '../contexts/AuthContext';

import { Button } from 'react-bootstrap';


const BoardContainer = styled.div`
    max-width: 800px;
    margin: 0 auto;
    padding: 20px;
    white-space:pre-wrap;	// 엔터키 적용 시킴 \n
`;
const BoardHeader = styled.div`
    padding: 20px;

`;

const BoardButtonsContainer = styled.div`
    display: flex;
    justify-content: space-between;
    margin-bottom: 10px;
`;


const BoardPage = () => {

    // 게시글 번호 boardId 와 받아올 게시글 데이터 담긴 객체 boardData
    const { boardId } = useParams();
    const [boardData, setBoardData] = useState(null);
    const [messageData, setmessageData] = useState(null);
    const { isLoggedIn , setLoginRedirectPath , userName ,serialid , verifyToken } = useAuth();
    const navigate = useNavigate();
  const [showCommentBox, setShowCommentBox] = useState(false);
  const [commentBoxPosition, setCommentBoxPosition] = useState({ x: 0, y: 0 });
  const [selectedText, setSelectedText] = useState('');
const [commentText, setCommentText] = useState('');
	const [startoff, setStartoff] = useState('');
const [endoff, setEndoff] = useState('');


    // boardId 마다 각각의 페이지 이동 시킴 http://localhost:8000/boardpage/1 번 게시글 /2 번 게시글 ... 
	//
    // 즉, 내용을 get해서 불러오는 코드 
    useEffect(() => {
        const fetchData = async () => {
        try {


		/////////////// 조회수
                await fetch(`http://49.50.164.251:8000/boardpage/${boardId}/see`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                });


            const response = await fetch(`http://49.50.164.251:8000/boardpage/${boardId}`);
            const data = await response.json();
            setBoardData(data);
        } catch (error) {
            console.error('Error fetching data:', error);
        }
        };

        fetchData();
    }, [boardId]);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (showCommentBox) {
        setShowCommentBox(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showCommentBox]);
  const handleMouseUp = (e) => {
    e.stopPropagation(); // 이벤트 버블링 방지
    const selection = window.getSelection();
	      const range = selection.getRangeAt(0);
	    const startOffset = range.startOffset;
    const endOffset = range.endOffset;
	  setStartoff(startOffset);
	  setEndoff(endOffset);
    const text = selection.toString().trim();
    console.log(text);
	  console.log(`시작 위치:`, startOffset, `끝 위치:`, endOffset );
    if (text) {
      setSelectedText(text);
      const range = selection.getRangeAt(0);
      const rect = range.getBoundingClientRect();

      setCommentBoxPosition({
        x: rect.left + window.scrollX,
        y: rect.top + window.scrollY + rect.height,
      });
      setShowCommentBox(true);
    }
    // 댓글 창이 이미 표시되어 있고, 텍스트를 새로 드래그하지 않은 경우는 상태를 유지합니다.
  };
  const handleCommentBoxClick = (e) => {
    e.stopPropagation(); // 댓글 입력 UI에서의 이벤트 버블링 방지
  };
const handleCommentBoxMouseDown = (e) => {
  e.stopPropagation(); // 댓글 입력 UI에서의 mousedown 이벤트 버블링 방지
};
  const handleSubmitComment = async (comment) => {
    console.log('Submitting comment:', comment, 'on text:', selectedText);
        try {
            const response = await fetch(`http://49.50.164.251:8000/boardpage/${boardId}/dragcomment`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                  who_write: serialid,
		  comment: comment,	
		  start_point: startoff,
		  end_point: endoff,
          }),
            });

            // Refresh the board data after liking
            if(response.ok){

            const data = await response.json();
		    console.log("드래그 댓글 성공!!!");

            }
        } catch (error) {
            console.error('Error liking board:', error);
        }
	  
    // 여기서 서버로 댓글 데이터를 전송하는 로직을 구현합니다.
  };

const handleClick = async (e) => {
  verifyToken();
  if (!isLoggedIn) {
    e.preventDefault();
  // If not logged in, navigate to the signin page
  alert('게시글 수정은 로그인 후 이용하실 수 있습니다.');
  setLoginRedirectPath('/boardpage/' + boardId); // 리디렉트 경로 설정
  navigate('/signin');
  }
  else{
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
	  console.log('여기 1');
          if(!data.result){
	  console.log('여기 2');
          }
	  else{
	  navigate(`/boardedit/${boardId}`);
		 }
      }
      else{
	      
	  console.log('여기 3');

      }



    } catch (error) {
      console.error('Error liking board:', error);
    }
  }
};
    // 핸들러, 좋아요 버튼
    const handleLike = async () => {
        try {
            const response = await fetch(`http://49.50.164.251:8000/boardpage/${boardId}/like`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
		body: JSON.stringify({
                  serial_id: serialid,
          }),
            });

            // Refresh the board data after liking
	    if(response.ok){

            const data = await response.json();

	    if(data.message){
		  alert("이미 해당 게시물에 추천하기를 눌렀습니다.");  
	    }
	    }
		 const response2 = await fetch(`http://49.50.164.251:8000/boardpage/${boardId}`    );
             const data = await response2.json();
             setBoardData(data);
        } catch (error) {
            console.error('Error liking board:', error);
        }

    };


    // 받아온 데이터로 화면에 띄울 frame
    return (
        <BoardContainer>
	
	
	    
	    {boardData && (    

<div>
      <BoardDeleteButton boardId={boardId} />
      <span
        style={{
          cursor: 'pointer',
          color: 'blue', // 클릭 가능한 텍스트의 색상을 설정할 수 있음
          textDecoration: 'underline', // 클릭 가능한 텍스트에 밑줄 추가
        }}
        onClick={handleClick}
      >
        수정하기
      </span>
      <span>
        조회수 <strong>{boardData.see}</strong>
      </span>
      <span
        style={{
          cursor: 'pointer',
          color: 'blue', // 클릭 가능한 텍스트의 색상을 설정할 수 있음
          textDecoration: 'underline', // 클릭 가능한 텍스트에 밑줄 추가
        }}
        onClick={handleLike}
      >
        추천하기
      </span>
	<strong>{boardData.likes}</strong>
    </div>



	    )}
	    <BoardHeader>
	   {boardData && (
          	<table className="table">
            	<tbody>
              	<tr>
                <th scope="row">카테고리</th>
                <td>{boardData.category}</td>
              	</tr>
              	<tr>
                <th scope="row">제목</th>
                <td>{boardData.title}</td>
              	</tr>
		<tr>
                <th scope="row">작성자</th>
                <td>{boardData.username}</td>
                </tr>
              	<tr>
                <th scope="row">작성날짜 / 수정날짜</th>
                <td>{boardData.write_time} / {boardData.update_time}</td>
              	</tr>
              
            	</tbody>
          	</table>
           )}
	    
	    </BoardHeader>
	           {boardData ? (


<div style={{ position: 'relative' }}>
    <div  onMouseUp={handleMouseUp}>
                <p>내용: {boardData.content}</p>
			   
<BoardDragComment  style={{ position: 'absolute', right: 0, top: 0 }}  boardId={boardId}   />
     </div>
</div>


           ) : (
               <p>Loading...</p>
           )}

	    {/* boardId를 상속시킨다.  */}
            <BoardComment boardId={boardId}/>
	

	     {showCommentBox && (
        <div
          style={{
            position: 'absolute',
            top: commentBoxPosition.y + 'px',
            left: commentBoxPosition.x + 'px',
          }}
		     onMouseDown={handleCommentBoxMouseDown} // mousedown 이벤트 핸들러 추가
          onClick={handleCommentBoxClick} // 댓글 입력 UI 클릭 시 이벤트 버블링 방지
        >
          <input type="text" placeholder="댓글 달기..."  value={commentText}
  onChange={(e) => setCommentText(e.target.value)} />
          <button onClick={(e) => {
            e.stopPropagation(); // 제출 버튼 클릭 시 이벤트 버블링 방지
            handleSubmitComment(commentText);
		    setCommentText(''); // 댓글 제출 후 입력란 초기화

          }}>제출</button>
        </div>
      )}
        </BoardContainer>
    );
};

export default BoardPage;
