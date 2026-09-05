from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.database.deps import get_db
from app.models.users import User
from app.schemas.auth import LoginRequest, RegisterRequest, TokenResponse, AuthenticatedUserResponse
from app.auth.security import verify_password, get_password_hash, create_access_token

router = APIRouter(prefix="/api/auth", tags=["Authentication"])

@router.post("/register", response_model=TokenResponse)
def register(reg_data: RegisterRequest, db: Session = Depends(get_db)):
    existing = db.query(User).filter(User.username == reg_data.username).first()
    if existing:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="Username already registered"
        )
    
    # Map any display role names to backend roles if needed
    role = reg_data.role
    if role not in ["admin", "traffic_authority", "municipal_authority"]:
        if "traffic" in role.lower():
            role = "traffic_authority"
        elif "muni" in role.lower():
            role = "municipal_authority"
        else:
            role = "admin"

    new_user = User(
        username=reg_data.username,
        password_hash=get_password_hash(reg_data.password),
        role=role,
        is_active=True
    )
    db.add(new_user)
    db.commit()
    db.refresh(new_user)

    access_token = create_access_token(
        subject=new_user.id,
        username=new_user.username,
        role=new_user.role
    )
    
    return TokenResponse(
        accessToken=access_token,
        tokenType="bearer",
        user=AuthenticatedUserResponse(
            id=new_user.id,
            username=new_user.username,
            role=new_user.role
        )
    )

@router.post("/login", response_model=TokenResponse)
def login(login_data: LoginRequest, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.username == login_data.username).first()
    
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect username or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
        
    if not verify_password(login_data.password, user.password_hash):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect username or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
        
    if not user.is_active:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Inactive user",
            headers={"WWW-Authenticate": "Bearer"},
        )

    access_token = create_access_token(
        subject=user.id,
        username=user.username,
        role=user.role
    )
    
    return TokenResponse(
        accessToken=access_token,
        tokenType="bearer",
        user=AuthenticatedUserResponse(
            id=user.id,
            username=user.username,
            role=user.role
        )
    )
