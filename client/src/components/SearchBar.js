import React, { useState } from 'react';
import styled from 'styled-components';

const SearchContainer = styled.div`
  position: relative;
  width: 250px;
  height: 30px;
  background-color: #fff; /* Background color */
  border-radius: 40px; /* Adjust border-radius for rounded corners */
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1); /* Box shadow for a subtle lift effect */
  overflow: hidden; /* Ensure child elements don't extend beyond rounded corners */
`;

const Input = styled.input`
    width: calc(100% - 50px); /* Adjusted width to accommodate the icon */
    border: none;
    border-radius: 16px;
    padding: 12px;
    font-size: 14px;
    outline: none;
    margin-top: -7px; /* Adjust the margin-top value as needed */
`;

const SearchIcon = styled.img`
  position: absolute;
  width: 17px;
  top: 50%;
  right: 12px;
  transform: translateY(-50%); /* Center the icon vertically */
  cursor: pointer;
`;

const SearchBar = ({ onSearch }) => {
  const [searchTerm, setSearchTerm] = useState('');

  const handleSearch = () => {
    // Call the backend API with the search term
    fetch('http://localhost:8000/search', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ searchTerm }),
    })
      .then((response) => response.json())
      .then((data) => {
        // Handle the data (e.g., update state with search results)
        onSearch(data);
      })
      .catch((error) => {
        console.error('Error during search:', error);
      });
  };

  return (
    <SearchContainer>
      <Input
        type="text"
        placeholder="검색어 입력"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />
      <SearchIcon
        src="https://s3.ap-northeast-2.amazonaws.com/cdn.wecode.co.kr/icon/search.png"
        onClick={handleSearch}
      />
    </SearchContainer>
  );
};

export default SearchBar;

