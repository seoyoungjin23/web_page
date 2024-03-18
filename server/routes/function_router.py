from fastapi import APIRouter, HTTPException, Depends
from database import get_db_connection, fetch_all_data

router = APIRouter()

# 현재 접속자 가져오기
@router.get("/nowuser")
async def now_user(connection=Depends(get_db_connection)):
    with connection as conn:
        fetch_query = f"SELECT USER.username FROM USER WHERE exist = %s"
        query_params = (True, )
        exist_data = fetch_all_data(conn, fetch_query, query_params)
        
        if exist_data:
            return exist_data
        else:
            raise HTTPException(status_code=404, detail="현재 접속자가 존재하지 않습니다.")
        
