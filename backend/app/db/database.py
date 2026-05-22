import os
from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
from sqlalchemy.exc import OperationalError
from dotenv import load_dotenv

load_dotenv()

SQLALCHEMY_DATABASE_URL = os.getenv("DATABASE_URL", "postgresql://postgres:postgres@localhost:5432/kisanmitra")

# Initialize engine with SQLite support and check connection availability
try:
    if SQLALCHEMY_DATABASE_URL.startswith("sqlite"):
        engine = create_engine(
            SQLALCHEMY_DATABASE_URL, connect_args={"check_same_thread": False}
        )
    else:
        engine = create_engine(SQLALCHEMY_DATABASE_URL)
    # Test connection immediately
    with engine.connect() as conn:
        pass
except OperationalError as e:
    # If connection fails and it was configured to postgresql, fallback to sqlite
    if "postgresql" in SQLALCHEMY_DATABASE_URL:
        print(f"\n[WARNING] PostgreSQL connection failed: {e}\n[WARNING] Falling back to local SQLite database: sqlite:///./sql_app.db\n")
        SQLALCHEMY_DATABASE_URL = "sqlite:///./sql_app.db"
        engine = create_engine(
            SQLALCHEMY_DATABASE_URL, connect_args={"check_same_thread": False}
        )
    else:
        raise e

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

Base = declarative_base()

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()