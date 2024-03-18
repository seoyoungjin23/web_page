import React from 'react';
import { Link } from 'react-router-dom';
import OnlineUserBox from '../components/OnlineUserBox.js';
import TodoList from '../components/TodoList.js';
const Home = () => {
  return (
    <div>
      <h1>Welcome to the Home Page!</h1>
      <OnlineUserBox/> 
	<TodoList />
    </div>
  );
};


export default Home;
