from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from routes.user_router import router as user_router
from routes.board_router import router as board_router
from routes.comment_router import router as comment_router
from routes.mypage_router import router as mypage_router
from routes.function_router import router as function_router

app = FastAPI()
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://49.50.164.251", "http://49.50.164.251:80"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# 사용자 관련 라우터 추가
app.include_router(user_router)
# 게시판 관련 라우터 추가
app.include_router(board_router)
# 댓글 관련 라우터 추가
app.include_router(comment_router)
# 마이페이지 관련 라우터 추가
app.include_router(mypage_router)
# 기능 관련 라우터 추가
app.include_router(function_router)

