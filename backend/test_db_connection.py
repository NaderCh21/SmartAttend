from sqlalchemy import create_engine

# Replace with your database URL
DATABASE_URL = "mysql+pymysql://root:root@localhost/attendance_db"

# Create engine
engine = create_engine(DATABASE_URL)

# Test the connection
def test_connection():
    try:
        with engine.connect() as connection:
            print("Connection successful!")
    except Exception as e:
        print("Connection failed:", str(e))

if __name__ == "__main__":
    test_connection()
