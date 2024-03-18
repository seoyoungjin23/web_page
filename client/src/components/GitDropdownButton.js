import React, { useState, useRef, useEffect } from 'react';
import '../css/bootstrap.css';


const GitDropdownButton = () => {
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const dropdownRef = useRef(null);

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


    useEffect(() => {
        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    return (
        <div className="dropdown" ref={dropdownRef} >
            <button
                // btn btn-secondary dropdown-toggle 에서 dropdown-toggle 없애면 화살표 제거됨
                className="btn btn-secondary"
                type="button"
                id="dropdownMenuButton1"
                data-bs-toggle="dropdown"
                aria-expanded="false"
                onClick={toggleDropdown}
                style={{
                    // 버튼 스타일 정의
                    backgroundColor: 'transparent',
                    border: 'none',
                    boxShadow: 'none', 
                }}
                >
                <img
                    src={ process.env.PUBLIC_URL + '/img/git_icon.png' }
                    alt="GitHub Icon"
                    style={{ width: '24px', height: '24px' }} 
                />
            </button>
            
            
            <ul
                className={`dropdown-menu ${isDropdownOpen ? 'show' : ''}`}
                aria-labelledby="dropdownMenuButton1"
                style={{ position: 'absolute', right: 0, backgroundColor: '#f8f9fa', }}
            >
                <li>
                    <a className="dropdown-item" href="https://github.com/foxirain" target="_blank" rel="noopener noreferrer">
                	하태구    
	    	</a>
                </li>
                <li>
                    <a className="dropdown-item" href="https://github.com/seoyoungjin23" target="_blank" rel="noopener noreferrer">
                	서영진    
	    	</a>
                </li>
                <li>
                    <a className="dropdown-item" href="https://github.com/han961004" target="_blank" rel="noopener noreferrer">
                	김동한    
	    	</a>
                </li>
            </ul>
        </div>

    );
};

export default GitDropdownButton;

