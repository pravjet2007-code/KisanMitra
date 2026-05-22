import os
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from .db.database import engine, Base
from .api.routes import products, orders, auth, addresses, cart, reviews, analytics, payments, ml, schemes, users

# Create database tables
Base.metadata.create_all(bind=engine)

# Ensure new user profile columns exist in postgres
from sqlalchemy import text
try:
    with engine.connect() as conn:
        for col, col_type in [
            ("farm_size", "VARCHAR(50)"),
            ("crop_type", "VARCHAR(100)"),
            ("business_name", "VARCHAR(255)"),
            ("business_type", "VARCHAR(100)"),
            ("preferred_language", "VARCHAR(50)"),
        ]:
            try:
                conn.execute(text(f"ALTER TABLE users ADD COLUMN IF NOT EXISTS {col} {col_type};"))
                conn.commit()
            except Exception as e:
                print(f"Error adding column {col}: {e}")
except Exception as db_err:
    print(f"Database column verification error: {db_err}")


app = FastAPI(
    title="KisanMitra E-commerce API",
    description="Production-Ready Backend for the KisanMitra Agritech Platform",
    version="1.1.0"
)

# CORS Configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=False,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Ensure static/uploads directory exists
os.makedirs("static/uploads", exist_ok=True)

# Mount Static Files
from fastapi.staticfiles import StaticFiles
app.mount("/static", StaticFiles(directory="static"), name="static")


# Include Routers
app.include_router(auth.router, prefix="/api/auth", tags=["auth"])
app.include_router(users.router, prefix="/api/user", tags=["user"])

app.include_router(products.router, prefix="/api/v1/products", tags=["products"])
app.include_router(orders.router, prefix="/api/v1/orders", tags=["orders"])
app.include_router(addresses.router, prefix="/api/v1/addresses", tags=["addresses"])
app.include_router(cart.router, prefix="/api/v1/cart", tags=["cart"])
app.include_router(reviews.router, prefix="/api/v1/reviews", tags=["reviews"])
app.include_router(analytics.router, prefix="/api/v1/analytics", tags=["analytics"])
app.include_router(payments.router, prefix="/api/v1/payments", tags=["payments"])
app.include_router(ml.router, prefix="/api", tags=["ml"])
app.include_router(schemes.router, prefix="/api/v1/schemes", tags=["schemes"])

@app.get("/")
def read_root():
    return {"message": "Welcome to KisanMitra E-commerce API"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("app.main:app", host="0.0.0.0", port=8000, reload=True)
