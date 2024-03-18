from fastapi import APIRouter, HTTPException, Depends
from models import InfoRequest, InfoData, PasswordData, MyPosts, RecommendPosts
from database import get_db_connection, execute_query, fetch_data, fetch_all_data
from passlib.context import CryptContext
from .user_router import create_access_token, create_refresh_token

router = APIRouter()

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

# 개인 정보 수정 정보 반환
@router.post("/mypage/edit")
async def info_request(info_request: InfoRequest, connection=Depends(get_db_connection)):
    with connection as conn:
        fetch_query = f"SELECT * FROM USER WHERE serial_id = %s"
        query_params = (info_request.serial_id,)
        user = fetch_data(conn, fetch_query, query_params)
        
        if user:
            return {"username": user["username"], "github": user["github"]}
        else:
            raise HTTPException(status_code=500, detail="정보를 전달하는 도중 오류가 발생했습니다.")

# 개인정보 수정
@router.post("/mypage/changeinfo")
async def modify_info(info_data: InfoData, connection=Depends(get_db_connection)):
    with connection as conn:
        update_query = "UPDATE USER SET username = %s, github = %s WHERE serial_id = %s"
        query_params = (info_data.username, info_data.github, info_data.serial_id)

        result = execute_query(conn, update_query, query_params)
        
        if result:
            access_token = create_access_token(data={"username": info_data.username, "serial_id": info_data.serial_id})
            refresh_token = create_refresh_token(data={"username": info_data.username, "serial_id": info_data.serial_id})
            return {"message": f"개인 정보 변경 성공", "access_token": access_token, "refresh_token": refresh_token}
        else:
            raise HTTPException(status_code=500, detail="개인정보를 수정 하는 중 오류가 발생했습니다.")

# 비밀번호 수정
@router.post("/mypage/changepasswd")
async def modify_password(password_data: PasswordData, connection=Depends(get_db_connection)):
    if password_data.new_password != password_data.new_password2:
        raise HTTPException(status_code=409, detail={"error": "새로 입력한 비밀번호가 일치하지 않습니다."})
    
    with connection as conn:
        fetch_query = f"SELECT password FROM USER WHERE serial_id = %s"
        query_params = (password_data.serial_id,)
        password = fetch_data(conn, fetch_query, query_params)
        
        if password and pwd_context.verify(password_data.password, password["password"]):
            hashed_password = pwd_context.hash(password_data.new_password)
            update_query = "UPDATE USER SET password = %s WHERE serial_id = %s"
            query_params = (hashed_password, password_data.serial_id)
            
            result = execute_query(conn, update_query, query_params)
            
            if result == True:
                return {"message": "비밀번호 변경 성공"}
            else:
                raise HTTPException(status_code=500, detail={"error": "데이터 저장 중 오류가 발생했습니다."})
        else:
            raise HTTPException(status_code=409, detail={"error": "비밀번호가 잘못되었습니다."})
        
# 자신이 쓴 게시글 목록 전부 받아오기
@router.post("/mypage/myposts")
async def myposts(myposts_data: MyPosts, connection=Depends(get_db_connection)):
    with connection as conn:
        fetch_query = f"SELECT BULLETIN.title, BULLETIN.content, BULLETIN.bulletin_serial_id FROM BULLETIN WHERE who_write = %s"
        query_params = (myposts_data.serial_id, )
        data = fetch_all_data(conn, fetch_query, query_params)
        
        if data:
            return data
        else:
            raise HTTPException(status_code=204, detail="작성한 글이 없습니다.")
        
# 자신이 추천한 게시글 목록 전부 받아오기
@router.post("/mypage/recommendedposts")
async def recommend_posts(recommend_data: RecommendPosts, connection=Depends(get_db_connection)):
    with connection as conn:
        fetch_query = f"""
            SELECT BULLETIN.title, BULLETIN.content, BULLETIN.bulletin_serial_id
            FROM BULLETIN
            JOIN RECOMMEND ON BULLETIN.bulletin_serial_id = RECOMMEND.where_like
            WHERE RECOMMEND.who_like = %s
        """
        query_params = (recommend_data.serial_id, )
        data = fetch_all_data(conn, fetch_query, query_params)
        
        if data:
            return data
        else:
            raise HTTPException(status_code=204, detail="추천한 글이 없습니다.")
        
