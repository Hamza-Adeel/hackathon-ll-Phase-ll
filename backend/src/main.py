"""
Main application entry point for the Todo Web Application - Backend Only
"""
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from slowapi.middleware import SlowAPIMiddleware
from .api.todos import router as todos_router
from .api.auth import router as auth_router
from .config import settings
from .logging_config import setup_logging
from .database import create_db_and_tables
from .rate_limiter import setup_rate_limiter



def create_app() -> FastAPI:
    """Create and configure the FastAPI application"""

    # Setup logging
    setup_logging(settings.DEBUG)

    # Create FastAPI app
    app = FastAPI(
        title=settings.APP_NAME,
        version="1.0.0",
        debug=settings.DEBUG,
        docs_url="/docs",
        redoc_url="/redoc"
    )

    # Add CORS middleware
    app.add_middleware(
        CORSMiddleware,
        allow_origins=["http://localhost:3000"],  # Frontend origin
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )

    # Add rate limiting middleware
    app.add_middleware(SlowAPIMiddleware)

    # Setup rate limiter
    setup_rate_limiter(app)

    # Include API routers - only todos API for backend foundation
    app.include_router(todos_router, prefix=f"{settings.API_V1_STR}/todos", tags=["todos"])
    app.include_router(auth_router, prefix=f"{settings.API_V1_STR}/auth", tags=["auth"])

    # Create database tables on startup
    @app.on_event("startup")
    def on_startup():
        create_db_and_tables()

    # Health check endpoint
    @app.get("/health")
    def health_check():
        return {"status": "healthy", "app": settings.APP_NAME}

    return app


app = create_app()


def main():
    """Main entry point for the application"""
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)


if __name__ == "__main__":
    main()