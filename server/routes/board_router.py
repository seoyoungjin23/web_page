from fastapi import APIRouter, HTTPException, Depends
from models import WritePost, VerifyRequest, Like
from database import get_db_connection, execute_query, fetch_data, fetch_all_data
from datetime import datetime, timedelta

router = APIRouter()

#------------------------------------------------------------------------------------------------

# 카테고리 목록 전부 가져오기
@router.get("/boardcategory/{category}")
async def get_category_posts(category: str, connection=Depends(get_db_connection)):
    with connection as conn:
        fetch_query = f"""
            SELECT USER.username, BULLETIN.* 
            FROM USER 
            JOIN BULLETIN ON USER.serial_id = BULLETIN.who_write 
            WHERE BULLETIN.category = %s
        """
        query_params = (category, )
        category_data = fetch_all_data(conn, fetch_query, query_params)
        
        if category_data:
            return category_data
        else:
            raise HTTPException(status_code=404, detail="해당 카테고리의 데이터가 존재하지 않습니다.")

#------------------------------------------------------------------------------------------------
        
# 게시글 가져오기
@router.get("/boardpage/{board_id}")
async def get_post(board_id: int, connection=Depends(get_db_connection)):
    with connection as conn:
        fetch_query = f"""
            SELECT USER.username, BULLETIN.* 
            FROM USER 
            JOIN BULLETIN ON USER.serial_id = BULLETIN.who_write 
            WHERE BULLETIN.bulletin_serial_id = %s
        """
        query_params = (board_id, )
        post_data = fetch_data(conn, fetch_query, query_params)
        
        if post_data:
            return post_data
        else:
            raise HTTPException(status_code=404, detail="해당 게시글의 데이터가 존재하지 않습니다.")

#------------------------------------------------------------------------------------------------

# 게시판 쓰기
@router.post("/boardwrite")
async def write_post(write_data: WritePost, connection=Depends(get_db_connection)):
    with connection as conn:
        now_time = datetime.now() + timedelta(hours=9)
        insert_query = "INSERT INTO BULLETIN (who_write, write_time, update_time, category, see, likes, title, content) VALUES (%s, %s, %s, %s, %s, %s, %s, %s)"
        query_params = (write_data.who_write, now_time, now_time, write_data.category, 0, 0, write_data.title, write_data.content)
        
        result = execute_query(conn, insert_query, query_params)
        
        if result:
            return {"message": "게시판 글을 등록했습니다."}
        else:
            raise HTTPException(status_code=500, detail={"error": "데이터 저장 중 오류가 발생했습니다."})

#------------------------------------------------------------------------------------------------

# 게시글 삭제
@router.delete("/boardpage/{board_id}")
async def delete_post(board_id: int, connection=Depends(get_db_connection)):
    with connection as conn:
        delete_query = "DELETE FROM BULLETIN WHERE bulletin_serial_id = %s"
        query_params = (board_id,)

        result = execute_query(conn, delete_query, query_params)

        if result:
            return {"message": f"{board_id} 게시글을 삭제했습니다."}
        else:
            raise HTTPException(status_code=500, detail="게시글을 삭제하는 중 오류가 발생했습니다.")

#------------------------------------------------------------------------------------------------

# 게시글 수정
@router.put("/boardpage/{board_id}")
async def edit_post(board_id: int, update_data: WritePost, connection=Depends(get_db_connection)):
    with connection as conn:
        update_time = datetime.now() + timedelta(hours=9)
        update_query = """
            UPDATE BULLETIN 
            SET title = %s, 
                content = %s, 
                category = %s, 
                update_time = %s
            WHERE bulletin_serial_id = %s
        """
        query_params = (update_data.title, update_data.content, update_data.category, update_time, board_id)

        result = execute_query(conn, update_query, query_params)

        if result:
            return {"message": f"{board_id} 게시글을 수정했습니다."}
        else:
            raise HTTPException(status_code=500, detail="게시글을 수정하는 중 오류가 발생했습니다.")

#------------------------------------------------------------------------------------------------

# 게시글 수정, 삭제 권한 확인 처리
@router.post("/boardpage/{board_id}/verify")
async def verify_post(board_id: int, edit_data: VerifyRequest, connection=Depends(get_db_connection)):
    with connection as conn:
        serial_id = edit_data.serial_id
        fetch_query = "SELECT who_write FROM BULLETIN WHERE bulletin_serial_id = %s"
        query_params = (board_id,)
        who_write_info = fetch_data(conn, fetch_query, query_params)

        if not who_write_info:
            raise HTTPException(status_code=500, detail="게시글 권한을 확인하는 중 오류가 발생했습니다.")

        who_write_serial_id = who_write_info['who_write']

        if who_write_serial_id == serial_id:
            return {"result": True}
        else:
            raise HTTPException(status_code=403, detail="권한이 없습니다.")
            
#------------------------------------------------------------------------------------------------

# 게시글 좋아요 업데이트
@router.post("/boardpage/{board_id}/like")
async def like_post(duplicate_like: Like, board_id: int, connection=Depends(get_db_connection)):
    with connection as conn:
        fetch_query = "SELECT * FROM RECOMMEND WHERE where_like = %s AND who_like = %s"
        query_params = (board_id, duplicate_like.serial_id)
        like = fetch_data(conn, fetch_query, query_params)
        
        if like is None:
            update_query = "UPDATE BULLETIN SET likes = likes + 1 WHERE bulletin_serial_id = %s"
            query_params = (board_id,)

            result1 = execute_query(conn, update_query, query_params)

            insert_query = "INSERT INTO RECOMMEND (where_like, who_like) VALUES (%s, %s)"
            query_params = (board_id, duplicate_like.serial_id)
            
            result2 = execute_query(conn, insert_query, query_params)
            
            if result1 and result2:
                return {"message": False} # 게시글을 좋아요 업데이트 성공
            else:
                raise HTTPException(status_code=500, detail="좋아요 업데이트를 하는 중 오류가 발생했습니다.")
        else:
            return {"message": True} # 게시글을 좋아요 중복으로 인한 실패

#------------------------------------------------------------------------------------------------

# 게시글 조회수 업데이트
@router.post("/boardpage/{board_id}/see")
async def see_post(board_id: int, connection=Depends(get_db_connection)):
    with connection as conn:
        update_query = "UPDATE BULLETIN SET see = see + 1 WHERE bulletin_serial_id = %s"
        query_params = (board_id,)

        result = execute_query(conn, update_query, query_params)

        if result:
            return {"message": f"{board_id} 게시글 조회수를 업데이트 했습니다."}
        else:
            raise HTTPException(status_code=500, detail="조회수 업데이트를 하는 중 오류가 발생했습니다.")

#------------------------------------------------------------------------------------------------

