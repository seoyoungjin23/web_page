import React from 'react';
import { Container, Row, Col, ListGroup } from 'react-bootstrap';
import { Link, Outlet } from 'react-router-dom';

const MyPage = () => {
  return (
    <Container fluid style={{ height: '100vh' }}>
      <Row style={{ height: '100%' }}>
        <Col md={3} className="bg-light" style={{ paddingTop: '60px' }}>
          <div>마이페이지</div>
          <ListGroup>
            <Link to="edit" className="list-group-item list-group-item-action">개인 정보 수정</Link>
            <Link to="changepw" className="list-group-item list-group-item-action">비밀번호 변경</Link>
            <Link to="myposts" className="list-group-item list-group-item-action">내 게시글</Link>
            <Link to="recommendedposts" className="list-group-item list-group-item-action">내가 추천한 게시글</Link>
          </ListGroup>
        </Col>
        <Col md={9} className="p-4">
          <Outlet />
        </Col>
      </Row>
    </Container>
  );
};

export default MyPage;

