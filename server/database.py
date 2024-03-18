import os
import mysql.connector
from mysql.connector import Error
from contextlib import contextmanager

# 데이터베이스 연결
def create_connection():
    try:
        return mysql.connector.connect(
            host="mysql",
            user=os.getenv("MYSQL_USER"),
            passwd=os.getenv("MYSQL_PASSWORD"),
            database=os.getenv("MYSQL_DATABASE"),
            charset="utf8mb4"
        )
    except Error as e:
        print(f"에러 '{e}' 발생")
        return None
    
# 데이터 베이스 종속성
@contextmanager
def get_db_connection():
    connection = create_connection()
    try:
        yield connection
    finally:
        if connection is not None:
            connection.close()

# 쿼리 실행 함수
def execute_query(connection, query, params=None):
    try:
        with connection.cursor() as cursor:
            cursor.execute(query, params)
            connection.commit()
            return True
    except Error as e:
        if e.errno == 1062:
            return "email duplicate"
        return False

# 데이터를 가져오는 함수
def fetch_data(connection, query, params=None):
    try:
        with connection.cursor(dictionary=True) as cursor:
            cursor.execute(query, params)
            data = cursor.fetchone()
            return data
    except Error as e:
        print(f"에러 '{e}' 발생")
        return False

# 데이터를 전부 가져오는 함수
def fetch_all_data(connection, query, params=None):
    try:
        with connection.cursor(dictionary=True) as cursor:
            cursor.execute(query, params)
            data = cursor.fetchall()
            return data
    except Error as e:
        print(f"에러 '{e}' 발생")
        return False

