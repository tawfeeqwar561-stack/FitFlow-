from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.config import settings
from app.database import engine, Base

# Import all routers
from app.routers.auth import router as auth_router
from app.routers.users import router as users_router
from app.routers.workouts import router as workouts_router
from app.routers.nutrition import router as nutrition_router
from app.routers.medical import router as medical_router
from app.routers.mindfulness import router as mindfulness_router

# Create FastAPI app
app = FastAPI(
    title=settings.APP_NAME,
    description="AI-Powered Fitness and Wellness Application",
    version="1.0.0"
)

# CORS Middleware - Allows frontend to connect
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# Create tables on startup
@app.on_event("startup")
async def startup():
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)


# Health check route
@app.get("/")
async def root():
    return {
        "message": f"Welcome to {settings.APP_NAME} API",
        "status": "running"
    }


# Health check for API
@app.get("/health")
async def health_check():
    return {
        "status": "healthy",
        "app_name": settings.APP_NAME
    }


# Test database connection
@app.get("/test-db")
async def test_database():
    try:
        async with engine.connect() as conn:
            return {
                "status": "success",
                "message": "Database connected successfully!"
            }
    except Exception as e:
        return {
            "status": "error",
            "message": str(e)
        }


# Include all routers
app.include_router(auth_router)
app.include_router(users_router)
app.include_router(workouts_router)
app.include_router(nutrition_router)
app.include_router(medical_router)
app.include_router(mindfulness_router)