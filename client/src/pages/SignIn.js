import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Link , useNavigate} from 'react-router-dom';
import '../css/bootstrap.css';
import { useAuth } from '../contexts/AuthContext';

const SignIn = () => {
  const { login, isLoggedIn } = useAuth();	
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  if(isLoggedIn){
	navigate('/');
  }

  
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch('http://49.50.164.251:8000/signin', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: formData.email,
          password: formData.password,
        }),
      });

      // 가입 후 홈으로 리턴
      const data = await response.json();
      if (response.ok) {
	login(data.access_token, data.username , data.serial_id); // Context API를 통해 로그인 상태 업데이트
        localStorage.setItem('refreshToken', data.refresh_token);
        console.log('로그인 성공' + data.refresh_token + "    " + data.access_token);
      } else {
        console.log('로그인 실패');
	alert('이메일 혹은 패스워드를 확인해주세요');
      }

    } catch (error) {
      console.error('Error during signin:', error);
      alert('에러 발생');
    }

  };	

  return (
    <div className="container">
      <div className="row justify-content-center mt-5">
        <div className="col-sm-9 col-md-7 col-lg-5">
          <div className="card">
            <div className="card-body">  
              <h5 className="card-title text-center">Log In</h5>
                <form className='form-signin' onSubmit={handleSubmit}>
                  <div className="form-label-group">          
                    <input
                      type="text"
                      className="form-control"
                      id="email"
                      name="email"
                      value={formData.email}
                      placeholder='Email'
                      onChange={handleChange}
                      required
                    /><br/>
                  </div>
                  <div className="form-label-group">
                    <input
                      type="password"
                      className="form-control"
                      id="password"
                      name="password"
                      value={formData.password}
                      placeholder='Password'
                      onChange={handleChange}
                      required
                    />
                  </div>
                  <hr />
                  <button type="submit" className="btn btn-primary btn-block">
                    Sign In
                  </button>
                  <hr className="my-4" />          
                </form>

                <p className="mt-3">
                  계정이 없으신가요? <Link to="/signup">회원가입</Link>
                </p>
                
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignIn;
