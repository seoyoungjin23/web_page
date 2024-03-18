import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';

// 컴포넌트들
import Header from './components/Header';
import Footer from './components/Footer';

// 페이지들
import Home from './pages/Home';
import BoardPage from './pages/BoardPage';
import BoardCategory from './pages/BoardCategory';
import About from './pages/About';
import SignIn from './pages/SignIn';
import SignUp from './pages/SignUp';
import BoardWrite from './pages/BoardWrite';
import BoardEdit from './pages/BoardEdit';
import MyPage from './pages/MyPage';
import ChangePw from './pages/ChangePw';
import PersonalInfoEdit from './pages/PersonalInfoEdit';
import MyPosts from './pages/MyPosts';
import MyRecommendedPosts from './pages/MyRecommendedPosts';

const App = () => {

  



  return (
      <AuthProvider>
      	<div >
        	{/* Fixed Header */}
        	<Header />
        
        	{/* Dynamic Content based on Routes */}
        	<Routes>
        	  {/* 각 페이지 형식들을 (형식들) 라우트 시킴 => <Route path='' element={}/> */}
          	<Route path="/" element={<Home />} />
          	<Route path="/about" element={<About />} />
          	<Route path="/boardcategory/:category" element={<BoardCategory />} />
          	<Route path="/boardpage/:boardId" element={<BoardPage />} />
          	<Route path='/signup' element={<SignUp />}/>
          	<Route path='/signin' element={<SignIn />}/>
          	<Route path='/boardwrite' element={<BoardWrite />}/>
          	<Route path="/boardedit/:boardId" element={<BoardEdit />} />
          <Route path='/mypage' element={<MyPage/>}>
            <Route path='edit' element={<PersonalInfoEdit />} />
            <Route path='changepw' element={<ChangePw />} />
            <Route path='myposts' element={<MyPosts />} />
            <Route path='recommendedposts' element={<MyRecommendedPosts />} />
          </Route>
        	</Routes>
        
        	{/* 하단 고정 시킬 것이 생긴다면 Footer 사용 */}

      	</div>
     </AuthProvider>
  );
}

export default App;
