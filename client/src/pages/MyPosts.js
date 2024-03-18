import React, { useState, useEffect } from 'react';

import { useAuth } from '../contexts/AuthContext';


const MyPosts = () => {
  const [posts, setPosts] = useState([]);
  const { serialid } = useAuth(); 


  useEffect(() => {
    // Fetch your posts data, replace this with actual API call or local data fetching
    const fetchPosts = async () => {
      try {
        const response = await fetch(`http://49.50.164.251:8000/mypage/myposts`, {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
		},
		body: JSON.stringify({
			serial_id : serialid,
		}),
	});


        const data = await response.json();
        console.log('API Response:', data); // Add this line to check the structure of data
	
	setPosts(data);
      } catch (error) {
        console.error('Error fetching posts:', error);
      }
    };

    fetchPosts();
  },[serialid]);

  return (
    <div>
      
      <ul>
        {Array.isArray(posts) && posts.map(post => (
          <li key={post.id}>

    <a href={`http://49.50.164.251/boardpage/${post.bulletin_serial_id}`}>

            <h2>{post.title}</h2>
            <p>{post.content}</p>
</a>
	</li>
        ))}
      </ul>
    </div>
  );
};

export default MyPosts;

