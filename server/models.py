from pydantic import BaseModel, EmailStr

# -- user
# 회원가입 데이터 모델
class SignupData(BaseModel):
    email: EmailStr
    password: str
    username: str
    github: str

# 로그인 데이터 모델
class SigninData(BaseModel):
    email: EmailStr
    password: str

# 로그아웃 데이터 모델
class LogoutData(BaseModel):
    serial_id: int

# 토큰 데이터 모델
class TokenData(BaseModel):
    username: str
    serial_id: int

# -- board
# 게시판 쓰기 모델
class WritePost(BaseModel):
    who_write: int
    title: str
    content: str
    category: str

# 권한 반환 모델
class VerifyRequest(BaseModel):
    serial_id: int

# 좋아요 모델
class Like(BaseModel):
    serial_id: int

# -- comment
# 댓글 쓰기 모델
class WriteComment(BaseModel):
    who_write: int
    comment: str

# 드래그 댓글 쓰기 모델
class DragComment(BaseModel):
    who_write: int
    start_point: int
    end_point: int
    comment: str

# -- mypage
# 개인 정보 수정 정보 반환 모델
class InfoRequest(BaseModel):
    serial_id: int

# 개인정보 수정 모델
class InfoData(BaseModel):
    serial_id: int
    username: str
    github: str
    
# 패스워드 수정 모델
class PasswordData(BaseModel):
    serial_id: int
    password: str
    new_password: str
    new_password2: str

# 내가 쓴 게시글 모델
class MyPosts(BaseModel):
    serial_id: int

# 내가 추천한 게시글 모델
class RecommendPosts(BaseModel):
    serial_id: int
    
