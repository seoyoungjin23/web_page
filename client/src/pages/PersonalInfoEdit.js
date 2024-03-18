import React, { useState , useEffect } from 'react';
import { Form, Button, Container } from 'react-bootstrap';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

const PersonalInfoEdit = () => {
  // 초기 상태 설정
  const [userInfo, setUserInfo] = useState({
    username: '',
    email: ''
  });
 const {serialid , setUserName} = useAuth(); 
 const [nowName, setnowName] = useState({});
 const [nowGit, setnowGit] = useState({});
  // 데이터 get 수신 코드
useEffect(() => {
  const fetchData = async () => {
    try {
      const response = await fetch('http://49.50.164.251:8000/mypage/edit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          serial_id: serialid,
        }),
      });



     console.log(serialid);

     // 여기 method get을 써야 F5 할 때마다 이름 주소 불러올거같음
      const data = await response.json();
      if (response.ok) {
        setnowName(data.username);
        setnowGit(data.github);
        console.log('성공');
      } else {
        console.log('실패');
      }
    } catch (error) {
      console.error('Error during data getting:', error);
      alert('에러 발생');
    }
  };

  fetchData();
} ,[serialid]);


  const handleChange = (e) => {
    const { name, value } = e.target;
    setUserInfo(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    // 폼 제출 로직
    // 예: userInfo 상태를 사용하여 서버에 업데이트 요청
    console.log('Updated Info:', userInfo);
    try {
      const response = await fetch('http://49.50.164.251:8000/mypage/changeinfo', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
	  serial_id : serialid,
          username: userInfo.username,
          github: userInfo.email,
        }),
      });
        if (response.ok) {
  // 성공 처리
                const data = await response.json();
		setUserName(userInfo.username);
		localStorage.setItem('token', data.access_token);
                localStorage.setItem('refreshToken', data.refresh_token);

                console.log("변경 성공:", data);
                alert('회원정보가 수정되었습니다.!');
        } else {
  // 오류 처리
  // 적절한 오류 메시지 표시
        }           //
	navigate('/mypage/edit');
    } catch (error) {
      console.error('Error during signup:', error);
    }
	  
  };

  return (
    <Container>
      <Form onSubmit={handleSubmit}>
        <Form.Group controlId="formUsername">
          <Form.Label>사용자 이름</Form.Label>
          <Form.Control
            type="text"
            name="username"
            value={userInfo.username}
            onChange={handleChange}
            placeholder={nowName}
          />
        </Form.Group>

        <Form.Group controlId="formEmail">
          <Form.Label>깃허브 주소</Form.Label>
          <Form.Control
            type="text"
            name="email"
            value={userInfo.email}
            onChange={handleChange}
            placeholder={nowGit}
          />
        </Form.Group>

        <Button variant="primary" type="submit">
          정보 업데이트
        </Button>
      </Form>
    </Container>
  );
};

export default PersonalInfoEdit;

