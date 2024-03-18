import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import styled from 'styled-components';
import BoardWriteButton from '../components/BoardWriteButton';

import '../css/bootstrap.css';

const BoardCategory = () => {
  const { category } = useParams();
  const [categoryPosts, setCategoryPosts] = useState([]);

  // 데이터 get 수신 코드
  useEffect(() => {
    console.log("Category:", category);

    const fetchCategoryPosts = async () => {
      try {
        const response = await fetch(`http://49.50.164.251:8000/boardcategory/${category}`);
        const data = await response.json();
        setCategoryPosts(data);
      } catch (error) {
        console.error(`Error fetching posts for category ${category}:`, error);
      }
    };

    fetchCategoryPosts();
  }, [category]);


  return (
    <div class="container my-3">
      <h1>Posts in Category: {category}</h1>
      <table class="table">
        <thead>
          <tr class="table-dark">
            <th>번호</th>
            <th>제목</th>
            <th>작성자</th>
            <th>작성일시</th>
	    <th>추천</th>
          </tr>
        </thead>
        <tbody>
           {Array.isArray(categoryPosts) &&
            categoryPosts.map((post) => (
              <tr key = { post.bulletin_serial_id }>
                <td>{ post.bulletin_serial_id }</td>
                  <td>
                    <Link to = {`/boardpage/${post.bulletin_serial_id}`}>{post.title}</Link>
                  </td>
                <td>{ post.username }</td>
                <td>{ post.write_time }</td>
		<td>{ post.likes }</td>
              </tr>
          ))}
        </tbody>
      </table>

      <BoardWriteButton />
    
    </div>
  );
};

export default BoardCategory;



