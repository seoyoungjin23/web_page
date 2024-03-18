import React, { useState, useRef, useEffect } from 'react';
import '../css/bootstrap.css';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const StateDropdownButton = () => {
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const { isLoggedIn, logout, userName, serialid } = useAuth();
    const dropdownRef = useRef(null);
    const navigate = useNavigate();

    // 드롭다운이 open close 되는 set 설정
    const toggleDropdown = () => {
        setIsDropdownOpen(!isDropdownOpen);
    }

    // 드롭다운 open시 외부 클릭했을 때 close 되는 설정
    const handleClickOutside = (event) => {
        if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
            setIsDropdownOpen(false);
        }
    };
    // 로그인 되었을 때와 아닐 때의 분기
    const handleLoginClick = () => {
        if (!isLoggedIn) {
            // If not logged in, navigate to the signin page
            navigate('/signin');
        } else {
            // If logged in, toggle the dropdown
            toggleDropdown();
            console.log('userName', userName);

        }
    };
    
    const handleLogout = () => {
        try {
            logout();
        } catch (error) {
            console.error('Error logging out:', error);
        }
    };


    useEffect(() => {
        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
        console.log('userName', userName);
    }, [userName]);

    return (
        <div className="dropdown" ref={dropdownRef} >
            <button
                // btn btn-secondary dropdown-toggle 에서 dropdown-toggle 없애면 화살표 제거됨
                className="btn btn-secondary"
                type="button"
                id="dropdownMenuButton1"
                data-bs-toggle="dropdown"
                aria-expanded="false"
                onClick={handleLoginClick}

                style={{
                    // 버튼 스타일 정의
                    backgroundColor: 'transparent',
                    border: 'none',
                    boxShadow: 'none',
                }}
            >
                {isLoggedIn ? `${userName}님` : '로그인'}
            </button>

            {isLoggedIn ? (
                <ul
                    className={`dropdown-menu ${isDropdownOpen ? 'show' : ''}`}
                    aria-labelledby="dropdownMenuButton1"
                    style={{ position: 'absolute', right: 0, backgroundColor: '#f8f9fa' }}
                >
                    <li>
                        <a className="dropdown-item" href="#" onClick={handleLogout}>
                            로그아웃
                        </a>
                    </li>
                    <li>
                        <a className="dropdown-item" href="/mypage/edit">
                            마이페이지
                        </a>
                    </li>
                </ul>
            ) : null}
        </div>

    );
};

export default StateDropdownButton;

