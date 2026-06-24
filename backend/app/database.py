from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, declarative_base

# ---------------- DATABASE URL ----------------
DATABASE_URL = "mysql+pymysql://root:2002@localhost:3306/sentra_chat"

# ---------------- ENGINE ----------------
engine = create_engine(
    DATABASE_URL,
    pool_pre_ping=True,
    pool_recycle=300,   # prevents MySQL connection timeout issues
    echo=False          # set True if you want SQL logs
)

# ---------------- SESSION ----------------
SessionLocal = sessionmaker(
    autocommit=False,
    autoflush=False,
    bind=engine
)

# ---------------- BASE ----------------
Base = declarative_base()


# ---------------- DEPENDENCY ----------------
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()