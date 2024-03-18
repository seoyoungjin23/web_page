from fastapi import APIRouter, HTTPException, Depends
from models import SignupData, SigninData, LogoutData, TokenData
from database import get_db_connection, execute_query, fetch_data
from passlib.context import CryptContext
from jose import JWTError, jwt
from datetime import datetime, timedelta
from fastapi.security import OAuth2PasswordBearer

router = APIRouter()

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="signin")

# 회원가입
@router.post("/signup")
async def signup(signup_data: SignupData, connection=Depends(get_db_connection)):
    with connection as conn:
        hashed_password = pwd_context.hash(signup_data.password)
        insert_query = "INSERT INTO USER (email, password, username, github, exist) VALUES (%s, %s, %s, %s, %s)"
        query_params = (signup_data.email, hashed_password, signup_data.username, signup_data.github, False)

        result = execute_query(conn, insert_query, query_params)
    
        if result == True:
            return {"message": "회원가입 성공"}
        elif result == "email duplicate":
            raise HTTPException(status_code=409, detail={"error": "이미 사용중인 이메일 주소입니다."})
        else:
            raise HTTPException(status_code=500, detail={"error": "데이터 저장 중 오류가 발생했습니다."})

# 로그인
@router.post("/signin")
async def signin(signin_data: SigninData, connection=Depends(get_db_connection)):
    with connection as conn:
        fetch_query = f"SELECT * FROM USER WHERE email = %s"
        query_params = (signin_data.email,)
        user = fetch_data(conn, fetch_query, query_params)

        if user and pwd_context.verify(signin_data.password, user["password"]):
            access_token = create_access_token(data={"username": user["username"], "serial_id": user["serial_id"]})
            refresh_token = create_refresh_token(data={"username": user["username"], "serial_id": user["serial_id"]})
            
            update_query = "UPDATE USER SET exist = %s WHERE email = %s"
            query_params = (True, signin_data.email)
            execute_query(conn, update_query, query_params)
            return {"access_token": access_token, "refresh_token": refresh_token, "username": user["username"], "serial_id": user["serial_id"], "token_type": "bearer"}
        else:
            raise HTTPException(status_code=409, detail={"error": "이메일 또는 비밀번호가 잘못되었습니다."})

# 로그아웃
@router.post("/logout")
async def signin(logout_data: LogoutData, connection=Depends(get_db_connection)):
    with connection as conn:
        update_query = "UPDATE USER SET exist = %s WHERE serial_id = %s"
        query_params = (False, logout_data.serial_id)
        result = execute_query(conn, update_query, query_params)
        
        if result:
            return {"message": "로그아웃에 성공했습니다."}
        else:
            HTTPException(status_code=500, detail={"error": "로그아웃 중에 오류가 발생했습니다."})

# Refresh Token으로 Access Token 재발급
@router.post("/refresh")
async def refresh_token(refresh_token: str = Depends(oauth2_scheme)):
    token_data = verify_token(refresh_token)

    new_refresh_token = create_refresh_token(data={"username": token_data.username, "serial_id": token_data.serial_id})
    new_access_token = create_access_token(data={"username": token_data.username, "serial_id": token_data.serial_id})
    return {"access_token": new_access_token, "refresh_token": new_refresh_token, "username": token_data.username, "serial_id": token_data.serial_id, "token_type": "bearer"}

# Access Token 유효성 검사
@router.post("/verify")
async def verify(token: str = Depends(oauth2_scheme)):
    token_data = verify_token(token)
    return {"message": True, "username": token_data.username, "serial_id": token_data.serial_id}

# 기능
# jwt 토큰 생성 함수
SECRET_KEY = "8804815e2b98d34bcd9a3f1e109f448b254baf6f50532cdfe633aa7ba95d7157"
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 30
REFRESH_TOKEN_EXPIRE_DAYS = 1 

# Access Token 생성 함수
def create_access_token(data: dict):
    to_encode = data.copy()
    expire = datetime.utcnow() + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt

# Refresh Token 생성 함수
def create_refresh_token(data: dict):
    to_encode = data.copy()
    expire = datetime.utcnow() + timedelta(days=REFRESH_TOKEN_EXPIRE_DAYS)
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt

# Token 검증 함수
def verify_token(token: str):
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        username: str = payload.get("username")
        serial_id: int = payload.get("serial_id")
        if username == None or serial_id == None:
            raise HTTPException(status_code=401, detail="로그인 세션이 만료되었습니다.")
        return TokenData(username=username, serial_id=serial_id)
    except JWTError:
        raise HTTPException(status_code=401, detail="로그인 세션이 만료되었습니다.")
    
