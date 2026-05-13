import os
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from .db.database import engine, Base
from .api.routes import products, orders, auth, addresses, cart, reviews, analytics, payments, ml

# Create database tables
Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="KisanMitra E-commerce API",
    description="Production-Ready Backend for the KisanMitra Agritech Platform",
    version="1.1.0"
)

# CORS Configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
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
app.include_router(products.router, prefix="/api/v1/products", tags=["products"])
app.include_router(orders.router, prefix="/api/v1/orders", tags=["orders"])
app.include_router(addresses.router, prefix="/api/v1/addresses", tags=["addresses"])
app.include_router(cart.router, prefix="/api/v1/cart", tags=["cart"])
app.include_router(reviews.router, prefix="/api/v1/reviews", tags=["reviews"])
app.include_router(analytics.router, prefix="/api/v1/analytics", tags=["analytics"])
app.include_router(payments.router, prefix="/api/v1/payments", tags=["payments"])
app.include_router(ml.router, prefix="/api", tags=["ml"])

@app.get("/")
def read_root():
    return {"message": "Welcome to KisanMitra E-commerce API"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("app.main:app", host="0.0.0.0", port=8000, reload=True)
