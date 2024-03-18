from fastapi import APIRouter, HTTPException, Depends
from models import WriteComment, DragComment
from database import get_db_connection, execute_query, fetch_all_data
from datetime import datetime, timedelta

router = APIRouter()

# 댓글 불러오기
@router.get("/boardpage/{board_id}/comment")
async def get_comment(board_id: int, connection=Depends(get_db_connection)):
    with connection as conn:
        fetch_query = f"""
            SELECT USER.username, COMMENT2.* 
            FROM USER 
            JOIN COMMENT2 ON USER.serial_id = COMMENT2.who_write_com
            WHERE COMMENT2.where_write_com = %s
        """
        query_params = (board_id,)
        comment_data = fetch_all_data(conn, fetch_query, query_params)
        
        if comment_data:
            return comment_data
        else:
            raise HTTPException(status_code=204, detail="작성된 댓글이 없습니다.")

# 댓글 쓰기
@router.post("/boardpage/{board_id}/comment")
async def write_comment(board_id: int, write_data: WriteComment, connection=Depends(get_db_connection)):
    with connection as conn:
        now_time = datetime.now() + timedelta(hours=9)
        insert_query = f"""
            INSERT INTO COMMENT2 (where_write_com, comment_time, comment_uptime, who_write_com, content_com) 
            VALUES (%s, %s, %s, %s, %s)
        """
        query_params = (board_id, now_time, now_time, write_data.who_write, write_data.comment)
        
        result = execute_query(conn, insert_query, query_params)
        
        if result == True:
            return {"message": "댓글 쓰기 성공"}
        else:
            raise HTTPException(status_code=500, detail={"error": "데이터 저장 중 오류가 발생했습니다."})

# 드래그 댓글 불러오기
@router.get("/temp")
async def get_comment(board_id: int, connection=Depends(get_db_connection)):
    with connection as conn:
        fetch_query = f"""
            SELECT USER.username, COMMENT.* 
            FROM USER 
            JOIN COMMENT ON USER.serial_id = COMMENT.who_write_com
            WHERE COMMENT.where_write_com = %s
        """
        query_params = (board_id,)
        comment_data = fetch_all_data(conn, fetch_query, query_params)
        
        if comment_data:
            return comment_data
        else:
            raise HTTPException(status_code=204, detail="작성된 댓글이 없습니다.")

# 드래그 댓글 쓰기
@router.post("/boardpage/{board_id}/dragcomment")
async def drag_comment(board_id: int, drag_data: DragComment, connection=Depends(get_db_connection)):
    with connection as conn:
        now_time = datetime.now() + timedelta(hours=9)
        insert_query = f"""
            INSERT INTO COMMENT (where_write_com, comment_time, comment_uptime, who_write_com, start_point, end_point, content_com) 
            VALUES (%s, %s, %s, %s, %s, %s, %s)
        """
        query_params = (board_id, now_time, now_time, drag_data.who_write, drag_data.start_point, drag_data.end_point, drag_data.comment)
        
        result = execute_query(conn, insert_query, query_params)
        
        if result == True:
            return {"message": "댓글 쓰기 성공"}
        else:
            raise HTTPException(status_code=500, detail={"error": "데이터 저장 중 오류가 발생했습니다."})

