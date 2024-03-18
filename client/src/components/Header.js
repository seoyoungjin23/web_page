import React, { useEffect, useRef, useState } from 'react';
import styled from 'styled-components';
import Sidebar from './Sidebar';
import GitDropdownButton from './GitDropdownButton';
import StateDropdownButton from './StateDropdownButton';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import SearchBar from './SearchBar';



const HeaderContainer = styled.header`
    display: flex;
    justify-content: space-between;
    align-items: center;
    background-color: #555;
    padding: 10px;
`;

const LogoAndToggleContainer = styled.div`
    display: flex;
    align-items: center;
`;

const Logo = styled.div`
    text-align: left;
    font-size: 1.5rem;
    font-weight: bold;
    color: #fff;
    margin-right: 20px; /* Adjust the margin as needed */
    cursor: pointer !important; /* Add !important to ensure it takes precedence */
`;

const SidebarToggle = styled.button`
    background: none;
    border: none;
    font-size: 1rem;
    color: #fff;
    cursor: pointer;
`;

const ButtonsContainer = styled.div`
    display: flex;
    align-items: center;
`;


const Header = () => {
    // 감자 클릭시 /홈으로 이동
    const navigate = useNavigate();
    const handleLogoClick = () => {
        navigate('/');
    };
    
	
    const [isSidebarOpen, setSidebarOpen] = useState(false);
    const { isLoggedIn, logout } = useAuth();
    const handleSidebarToggle = () => {
        setSidebarOpen(!isSidebarOpen);
    };

    // 사이드바 열렸을 때 X 눌러도 닫히게 만듬
    const handleSidebarClose = () => {
        setSidebarOpen(false);
    };

    
    return (
        <React.Fragment>
            <Sidebar isOpen={isSidebarOpen} onClose={handleSidebarClose} />
            <HeaderContainer>
                <LogoAndToggleContainer>
                    <SidebarToggle onClick={handleSidebarToggle}>
                    <img
                        src={ process.env.PUBLIC_URL + '/img/Hamburger_icon.svg' }
                        alt="Hamburger Icon"
                        style={{ width: '38px', height: '38px' }} 
                    />
                    </SidebarToggle>
                    <Logo onClick={handleLogoClick}>감자</Logo>

                </LogoAndToggleContainer>
                
	    <SearchBar />
	    
	    	<ButtonsContainer>
	        	<GitDropdownButton />
	                <StateDropdownButton />
	        </ButtonsContainer>
                

            </HeaderContainer>


            
        </React.Fragment>
    );
};

export default Header;
