
import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Link, useNavigate } from 'react-router-dom';
import '../css/bootstrap.css';
import { useAuth} from '../contexts/AuthContext';



const ChangePw = () => {
    const [responseMessage, setResponseMessage] = useState("");
    const { logout, isLoggedIn , serialid} = useAuth();
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        password: '',
        new_password: '',
        new_password2: '',
    });

    if (!isLoggedIn) {
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
            const response = await fetch('http://49.50.164.251:8000/mypage/changepasswd', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    serial_id: serialid,
                    password: formData.password,
                    new_password: formData.new_password,
                    new_password2: formData.new_password2,
                }),
            });

            // 가입 후 홈으로 리턴
            const data = await response.json();
            if (response.ok) {

                console.log('변경 성공');
                logout();

            } else {
                setResponseMessage(data.detail.error);

                console.log('변경 실패');
            }

        } catch (error) {
            console.error('Error during signin:', error);
        }

    };

    return (
        <div className="container">
            <div className="row justify-content-center mt-5">
                <div className="col-sm-9 col-md-7 col-lg-5">
                    <div className="card">
                        <div className="card-body">
                            <h5 className="card-title text-center">비밀번호 변경</h5>
                            <form className='form-signin' onSubmit={handleSubmit}>
                                <div className="form-label-group">
                                    <input
                                        type="password"
                                        className="form-control"
                                        id="password"
                                        name="password"
                                        value={formData.password}
                                        placeholder='이전 비밀번호'
                                        onChange={handleChange}
                                        required
                                    /><br />
                                </div>
                                <div className="form-label-group">
                                    <input
                                        type="password"
                                        className="form-control"
                                        id="new_password"
                                        name="new_password"
                                        value={formData.new_password}
                                        placeholder='변경 비밀번호'
                                        onChange={handleChange}
                                        required
                                    />
                                </div>
                                <div className="form-label-group">
                                    <input
                                        type="password"
                                        className="form-control"
                                        id="new_password2"
                                        name="new_password2"
                                        value={formData.new_password2}
                                        placeholder='변경 비밀번호 재확인'
                                        onChange={handleChange}
                                        required
                                    />
                                </div>
                                <hr />
                                <button type="submit" className="btn btn-primary btn-block">
                                    비밀번호 변경
                                </button>
                                <hr className="my-4" />
                               

                            </form>
                            {responseMessage && <p>{responseMessage}</p>}


                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ChangePw;


