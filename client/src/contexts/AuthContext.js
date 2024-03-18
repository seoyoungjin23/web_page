import React, { createContext, useState, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const AuthContext = createContext(null);

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [userName, setUserName] = useState('');
    const [serialid, setserialid] = useState();
    const [redirectPath, setRedirectPath] = useState(null);
    const navigate = useNavigate();

    const logout = async () => {
        try {
            console.log(serialid);
            // 서버로 로그아웃 요청을 보냄
            const response = await fetch(`http://49.50.164.251:8000/logout`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ serial_id: serialid }),
            });

            if (response.ok) {
                console.log('Logged out successfully from the server');
            } else {
                console.error('Failed to logout from the server'); // 서버 로그아웃 실패 시 여기서 함수 종료
            }
        } catch (error) {
            console.error('Error logging out from the server:', error); // 에러 발생 시 여기서 함수 종료
        }

        // 서버 로그아웃 성공 후 클라이언트 상태 업데이트
        localStorage.removeItem('token');
        localStorage.removeItem('refreshToken');
        setUserName(''); // 로그아웃 시 사용자 이름 초기화
        setIsLoggedIn(false);
        setserialid(null);
    };



    const verifyToken = async () => {
            console.log(serialid + "1 ");
        console.log('새로고침2');
        const token = localStorage.getItem('token');
        const refreshToken = localStorage.getItem('refreshToken');
            console.log(serialid + "2 ");
        try {
            let response = await fetch('http://49.50.164.251:8000/verify', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                }
            });

            if (response.ok) {
                const data = await response.json();
                setIsLoggedIn(true);
                setUserName(data.username);
                setserialid(data.serial_id);
            } else if (response.status === 401 && refreshToken) {
                response = await fetch('http://49.50.164.251:8000/refresh', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${refreshToken}`
                    }
                });

                if (response.ok) {
                    const data = await response.json();
                    setIsLoggedIn(true);
                    setUserName(data.username);
                    setserialid(data.serial_id);
                    localStorage.setItem('token', data.access_token);
                    localStorage.setItem('refreshToken', data.refresh_token);
                } else {
            console.log(serialid + "3 ");
                    alert('로그인 세션이 만료되었습니다.');
                    // 리프레시 토큰 만료 처리
                    logout();
                    // 로그인 페이지로 리다이렉트
                    window.location.href = '/signin';
                }
            } else {
                // 액세스 토큰 만료 처리
                logout();
            }
        } catch (error) {
            console.error('Error verifying token:', error);
        }
    }


    useEffect(() => {
        console.log('새로고침');
            console.log(serialid + "4");
        verifyToken(setIsLoggedIn, setUserName, setserialid, navigate, logout);
    }, []);
    const setLoginRedirectPath = (path) => {
        setRedirectPath(path);
    };
    const login = (token, name, serial_id) => {
        localStorage.setItem('token', token);
        setIsLoggedIn(true);
        setUserName(name);
        setserialid(serial_id);
        if (redirectPath) {
            navigate(redirectPath);
            setRedirectPath(null); // 경로 초기화
        }
        else {
            navigate('/');
        }


    };


    return (
        <AuthContext.Provider value={{ isLoggedIn, userName, serialid, login, logout, setLoginRedirectPath, verifyToken, setUserName }}>
            {children}
        </AuthContext.Provider>
    );
};

