// 완성
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../css/bootstrap.css';

const SignUp = () => {
  const navigate = useNavigate();


  // 폼데이터에 담아서 보낼 것 
  // 이메일, 패스워드, 유저네임, 깃허브 아이디
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    username: '',
    github: '',
  });

  // 버튼 핸들러, 아이템들을 set 시킴 
  const handleChange = (e) => {
    // 왜 name은 되고, email은 안 되지?
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  // 이메일 형식 검사 코드
  const validateEmail = (email) => {
  // 간단한 이메일 형식 검사 정규식
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
  };


  // 버튼 핸들러, 아이템들을 전송
  const handleSubmit = async (e) => {
    e.preventDefault();
    
	  
	  
    // 이메일 형식이 올바르지 않으면 경고 띄우기
    if (!validateEmail(formData.email)) {
        alert('이메일을 정확히 입력하세요.');
        return;
    }
    
	  
    // 비밀번호와 2차 비밀번호 일치 여부 확인
    // 일단 1차 2차 비밀번호가 같지 않으면 경고문 띄우고 안 넘김
    if (formData.password !== formData.confirmPassword) {
      alert('비밀번호가 일치하지 않습니다.');
      return;
    }

    try {
      const response = await fetch('http://49.50.164.251:8000/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: formData.email,
          password: formData.password,
          username: formData.username,
          github: formData.github,
        }),
      });
	console.log(formData.email + " " + formData.password + " " + formData.username + " " + formData.github )
      // 가입 후 홈으로 리턴
	if (response.ok) {
  // 성공 처리
  		const data = await response.json();
  		console.log("회원가입 성공:", data);
		alert('환영합니다!' + formData.username + '님');
  		navigate('/signin');
	} else {
  // 오류 처리
  		const errorData = await response.json();
  		console.error("회원가입 실패:", errorData);
  // 적절한 오류 메시지 표시
	}	    // 
    } catch (error) {
      console.error('Error during signup:', error);
    }
  };

  return (
    <div className="container">
      <div className="row justify-content-center mt-5">
        <div className="col-sm-9 col-md-7 col-lg-5">
          <div className="card">
            <div className="card-body">  
              <h5 className="card-title text-center">Sign Up</h5>
                <form className='form-signin' onSubmit={handleSubmit}>
                  <div className="form-label-group">          
                    <label htmlFor="email">이메일</label>
                    <input
                      type="text"
                      id="email"
                      className="form-control"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  <div className="form-label-group">
                    <label htmlFor="password">비밀번호</label>
                    <input
                      type="password"
                      id="password"
                      name="password"
                      className="form-control"
                      value={formData.password}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  <div className="form-label-group">
                    <label htmlFor="confirmPassword">비밀번호 확인</label>
                    <input
                      type="password"
                      id="confirmPassword"
                      name="confirmPassword"
                      className="form-control"
                      value={formData.confirmPassword}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  <div className="form-label-group">
                    <label htmlFor="username">이름</label>
                    <input
                      type="text"
                      id="username"
                      name="username"
                      className="form-control"
                      value={formData.username}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  <div className="form-label-group">
                    <label htmlFor="github">깃허브 아이디</label>
                    <input
                      type="text"
                      id="github"
                      name="github"
                      className="form-control"
                      value={formData.github}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  
                  <br/>
                  
                  <button className="btn btn-primary btn-block" type="submit">가입하기</button>
                
                </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignUp;
