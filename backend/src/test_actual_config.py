import sys
import os
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

from config import settings

print("DATABASE_URL from config:", repr(settings.DATABASE_URL))
print("NEON_DATABASE_URL from config:", repr(settings.NEON_DATABASE_URL))
print("JWT_SECRET_KEY from config:", repr(settings.JWT_SECRET_KEY))

# Test if the URL can be parsed by SQLAlchemy
from sqlalchemy import create_engine
if settings.NEON_DATABASE_URL or settings.DATABASE_URL:
    try:
        url_to_test = settings.NEON_DATABASE_URL or settings.DATABASE_URL
        print(f"Attempting to create engine with URL: {repr(url_to_test)}")

        # For testing, let's use a SQLite URL to avoid actual connection issues
        test_url = "sqlite:///./test.db"
        engine = create_engine(test_url)
        print("SQLite engine created successfully for testing!")

        # Test the actual URL parsing
        try:
            actual_engine = create_engine(url_to_test)
            print("Actual URL engine created successfully!")
        except Exception as e:
            print(f"Error with actual URL: {e}")

    except Exception as e:
        print(f"Error creating engine: {e}")
else:
    print("No database URL found in settings")