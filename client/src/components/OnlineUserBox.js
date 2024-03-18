import React, { useState, useEffect } from 'react';

const OnlineUsersBox = () => {
  const [onlineUsers, setOnlineUsers] = useState(0);
  const [userList, setUserList] = useState([]);


  const fetchOnlineUsers = async () => {
    try {
      const response = await fetch(`http://49.50.164.251:8000/nowuser`);
      const data = await response.json();
      setOnlineUsers(data.length);
	      console.log(data);
	          setUserList(Object.values(data)); // 사용자 리스트를 상태로 설정
	    console.log(userList);
    } catch (error) {
      console.error('Error fetching online users:', error);
    }
  };

  useEffect(() => {
    // 페이지가 처음 로드될 때 현재 접속자 수를 가져옴
    fetchOnlineUsers();
  }, []);

  const boxStyle = {
    border: '1px solid #ccc',
    padding: '10px',
    borderRadius: '5px',
    marginBottom: '20px',
  };

  const countStyle = {
    fontSize: '18px',
    fontWeight: 'bold',
    marginBottom: '10px',
  };

  const buttonStyle = {
    backgroundColor: '#007bff',
    color: '#fff',
    border: 'none',
    padding: '5px 10px',
    borderRadius: '3px',
    cursor: 'pointer',
  };

  const listStyle = {
    marginTop: '10px',
  };

  const itemStyle = {
    marginBottom: '5px',
  };

  return (
    <div style={boxStyle}>
      <p style={countStyle}>현재 접속자 수: {onlineUsers}</p>
      <button style={buttonStyle} onClick={fetchOnlineUsers}>새로고침</button>
      {/* 여기에 현재 접속자 리스트를 표시하는 부분을 추가할 수 있습니다 */}
      <div style={listStyle}>
       {Array.isArray(userList) && userList.map((user, index) => (
        <div key={index} style={itemStyle}>{user.username}</div>
	))}
	  
      </div>
    </div>
  );
};

export default OnlineUsersBox;

