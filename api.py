from fastapi import FastAPI, Query, HTTPException, Depends
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List
from sqlalchemy import create_engine, Column, Integer, String
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker, Session

app = FastAPI()

# CORS設定
origins = [
    "http://127.0.0.1:5173",
    "http://localhost:5173",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# SQLAlchemy設定
DATABASE_URL = "sqlite:///./test.db"
engine = create_engine(DATABASE_URL)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

Base = declarative_base()

# SQLAlchemyのItemモデル
class ItemDB(Base):
    __tablename__ = "items"
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, index=True)

# データベースの作成
Base.metadata.create_all(bind=engine)

# Pydanticモデルの定義
class Item(BaseModel):
    name: str

# 依存関係としてDBセッションを使用
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


@app.get("/contents", response_model=List[Item])
def read_content(skip: int = 0, limit: int = 10, db: Session = Depends(get_db)):
    """
    /contents エンドポイント:
    - 内容のリストを返す。
    - `skip` と `limit` パラメータでページネーションを実装。
    """
    items = db.query(ItemDB).offset(skip).limit(limit).all()
    return items

@app.post("/contents", response_model=Item, status_code=201)
def create_content(item: Item, db: Session = Depends(get_db)):
    """
    /contents エンドポイント:
    - 新しいアイテムを作成し、データベースに保存。
    """
    db_item = ItemDB(name=item.name)
    db.add(db_item)
    db.commit()
    db.refresh(db_item)
    return db_item
@app.delete("/contents/{delete_name}", response_model=Item)
def delete_content(delete_name: str, db: Session = Depends(get_db)):
    """
    /contents/{delete_name} エンドポイント:
    - delete_nameに一致するアイテムをデータベースから削除する。
    """
    # データベースから一致するアイテムを検索
    db_item = db.query(ItemDB).filter(ItemDB.name == delete_name).first()
    
    # アイテムが見つからない場合は404エラーを返す
    if db_item is None:
        raise HTTPException(status_code=404, detail="Item not found")
    
    # アイテムをデータベースから削除
    db.delete(db_item)
    db.commit()
    
    return db_item