import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import '../css/bootstrap.css';

const BoardEdit = () => {
  const { boardId } = useParams();
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    category: '',
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`http://49.50.164.251:8000/boardpage/${boardId}`);
        const data = await response.json();
        setFormData(data);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, [boardId]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch(`http://49.50.164.251:8000/boardpage/${boardId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        console.log(`Board ${boardId} updated successfully`);
        window.location.href = `/boardpage/${boardId}`;
      } else {
        console.error(`Error updating board ${boardId}`);
      }
    } catch (error) {
      console.error('Error updating board:', error);
    }
  };

  return (
    <div className="board-edit-container">
      <h2>게시글 수정</h2>
      <form onSubmit={handleSubmit} className="form-horizontal">
        <table className="table table-striped table-bordered">
          <tr>
            <th>제목:</th>
            <td>
              <input
                type="text"
                id="title"
                name="title"
                value={formData.title}
                onChange={handleChange}
                className="form-control"
              />
            </td>
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
             <option value="c">C</option>
             <option value="java">Java</option>
             <option value="python">Python</option>
             </select>
            </td>
          </tr>





          <tr>
            <th>내용:</th>
            <td>
              <textarea
                rows="30"
                id="content"
                name="content"
                value={formData.content}
                onChange={handleChange}
                className="form-control"
              />
            </td>
          </tr>
       
	
	
	</table>
        <button className="btn btn-primary" type="submit">
          수정하기
        </button>
      </form>
    </div>
  );
};

export default BoardEdit;

