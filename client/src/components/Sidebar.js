import React, { useEffect, useRef, useState } from 'react';
import styled from 'styled-components';
import { Link } from 'react-router-dom';

const SidebarContainer = styled.div`
  position: fixed;
  top: 0;
  left: ${({ isOpen }) => (isOpen ? '0' : '-100%')};
  width: 250px;
  height: 100%;
  background-color: #333;
  padding-top: 60px;
  transition: left 0.3s ease-in-out;
  z-index: 1001; /* Set a higher z-index value than the card-body */
`;

const CloseButton = styled.button`
  position: absolute;
  top: 20px;
  right: 20px;
  font-size: 1.5rem;
  color: #fff;
  background: none;
  border: none;
  cursor: pointer;
`;

const SidebarNavList = styled.ul`
  list-style: none;
  padding: 0;
`;

const SidebarNavItem = styled.li`
  margin: 1rem 0;
`;

const SidebarNavLink = styled(Link)`
  text-decoration: none;
  color: #fff;

  &:hover {
    text-decoration: underline;
  }
`;

const SubcategoryList = styled.ul`
  list-style: none;
  padding-left: 1rem;
`;

const SubcategoryItem = styled.li`
  margin: 0.5rem 0;
`;

// 열고 닫히는 사이드바 in 의 카테고리들의 코드
const SidebarLink = ({ to, children, subcategories = [], onClick }) => {
  const [isSubcategoryOpen, setSubcategoryOpen] = useState(false);


  const handleSubcategoryToggle = () => {
    setSubcategoryOpen(!isSubcategoryOpen);
  };

  
  return (
    <SidebarNavItem>
      <div onClick={() => {
        if (onClick) {
          onClick(); // Call the provided onClick function if it exists.
        }
        handleSubcategoryToggle();
      }}>
        <SidebarNavLink to={to}>{children}</SidebarNavLink>
      </div>
      {isSubcategoryOpen && subcategories.length > 0 && (
        <SubcategoryList>
          {subcategories.map((subcategory) => (
            <SubcategoryItem key={subcategory.to}>
              <SidebarNavLink to={subcategory.to}>{subcategory.label}</SidebarNavLink>
            </SubcategoryItem>
          ))}
        </SubcategoryList>
      )}
    </SidebarNavItem>
  );
};

// 실질적으로 열고 닫히는 사이드바
const Sidebar = ({ isOpen, onClose }) => {
  const dropdownRef = useRef(null);

  // 드롭다운 open시 외부 클릭했을 때 close 되는 설정
  const handleClickOutside = (event) => {
    if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        onClose();
    }
  };

  useEffect(() => {
      document.addEventListener('mousedown', handleClickOutside);
      return () => {
          document.removeEventListener('mousedown', handleClickOutside);
      };
  }, []);


  return (
    <SidebarContainer style={{ left: isOpen ? '0' : '-100%' }} ref={dropdownRef}>      
      <CloseButton onClick={onClose}>&times;</CloseButton>
      <SidebarNavList>
        <SidebarLink to="/about">About</SidebarLink>
        <SidebarLink
          // to="/boardCategory" to 이 기능이 페이지 이동시키는 거임
          subcategories={[
            { to: "/boardCategory/c", label: "C" },
            { to: "/boardCategory/java", label: "Java" },
            { to: "/boardCategory/python", label: "Python" }
          ]}
          onClick={() => {
            // Handle navigation logic or other actions when "BoardCategory" is clicked.
            // You can leave this empty if you don't need additional logic here.
          }}
        >
          BoardCategory
        </SidebarLink>
        <SidebarLink to="/">Temp1</SidebarLink>
        <SidebarLink to="/">Temp2</SidebarLink>

        {/* 추가적인 사이드바 메뉴들 */}
      </SidebarNavList>
    </SidebarContainer>
  );
};

export default Sidebar;






