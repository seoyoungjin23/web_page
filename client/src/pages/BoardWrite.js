import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../css/bootstrap.css';
import { useAuth } from '../contexts/AuthContext';




const BoardWrite = () => {
  const {isLoggedIn, logout, userName , serialid} = useAuth();
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    category: '',
    who_write: serialid,
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };
   
	
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    //// 카텍리가 빈칸일 시 alert 경고문 뜸
    if (!formData.category) {
       alert('카테고리를 선택하세요');
       return;
    }  
	  
	  
    try {
        const response = await fetch('http://49.50.164.251:8000/boardwrite', {
        method: 'POST',
 	headers: {
           'Content-Type': 'application/json',
	},
	body: JSON.stringify(formData),
	});
	} catch (error) {
	      console.error('Error while saving form data:', error);
	}
	window.history.back() 
  };


  return (
    <div className='board-write-container'>
      <h2>게시글 작성</h2>
      <form onSubmit={handleSubmit} class='form-horizontal'>
        <table class='table table-striped table-bordered'>
          <tr>
            <th>제목:</th>
            <td><input
              type="text"
              id="title"
              name="title"
              value={formData.title}
              onChange={handleChange}
              className='form-control'
            /></td>
          </tr>

	  <tr>
	     <th>카테고리:</th>
	     <td>
	     <select
	     id="category"
	     name="category"
	     value={formData.category}
	     onChange={handleChange}
	     className='form-control'
	     >
	    {/* 동적이 아니라 정적으로 카테고리 설정했음 */}
             <option value="">Select a category</option> {/* 라벨 */}
	     <option value="c">C</option>
	     <option value="java">Java</option>
	     <option value="python">Python</option>
	     </select>
	    </td>
	    </tr>

	   <tr>
	     <th>내용:</th>
	     <td><textarea
	     rows='30'
	     id="content"
	     name="content"
	     value={formData.content}
	     onChange={handleChange}
	     className='form-control'
	     /></td>
	   </tr>

        </table>
        <button className='btn btn-primary' type="submit">저장하기</button>
      </form>
    </div>
  );
};

export default BoardWrite;
