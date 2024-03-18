import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const BoardWriteButton = () => {
  const { isLoggedIn , setLoginRedirectPath , verifyToken } = useAuth();
  const navigate = useNavigate();
 
  const handleClick = (e) => {
	verifyToken();
  if (!isLoggedIn) {
	  e.preventDefault();
        // If not logged in, navigate to the signin page
	alert('게시글 작성은 로그인 후 이용하실 수 있습니다.');
	setLoginRedirectPath('/boardwrite'); // 리디렉트 경로 설정
  	navigate('/signin');
  } 
  };
  return (
    <Link to="/boardwrite">
      <button onClick = {handleClick}>게시글 작성</button>
    </Link>
  );
};

export default BoardWriteButton;
