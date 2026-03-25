import sqlite3
import os

db_path = 'business_analytics.db'
print(f"Setting up database at: {os.path.abspath(db_path)}")

# Connect to database
conn = sqlite3.connect(db_path)
cursor = conn.cursor()

# Create Tables
cursor.execute('''
CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id TEXT UNIQUE,
    name TEXT NOT NULL,
    role TEXT CHECK(role IN ('analyst', 'admin')) NOT NULL
)
''')

cursor.execute('''
CREATE TABLE IF NOT EXISTS Business_Data (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    Date TEXT,
    Product TEXT,
    Category TEXT,
    Region TEXT,
    Units_Sold INTEGER,
    Revenue REAL,
    Cost REAL,
    Logistics_Cost REAL,
    Overhead_Cost REAL,
    Total_Cost REAL,
    Net_Profit REAL,
    Loss REAL,
    Profit_Status TEXT,
    Loss_Percentage REAL,
    Loss_Reason TEXT,
    Customer_Age INTEGER,
    Gender TEXT,
    Season TEXT,
    Festival TEXT,
    Trend TEXT
)
''')

cursor.execute('''
CREATE TABLE IF NOT EXISTS Messages (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    sender_role TEXT NOT NULL,
    receiver_role TEXT NOT NULL,
    message TEXT NOT NULL,
    timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
    is_read INTEGER DEFAULT 0
)
''')

cursor.execute('''
CREATE TABLE IF NOT EXISTS notifications (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    message TEXT NOT NULL,
    status TEXT NOT NULL DEFAULT 'unread' CHECK(status IN ('read','unread')),
    timestamp TEXT NOT NULL DEFAULT (datetime('now')),
    FOREIGN KEY(user_id) REFERENCES users(id)
)
''')

cursor.execute('''
CREATE TABLE IF NOT EXISTS uploaded_data (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    file_name TEXT NOT NULL,
    file_path TEXT NOT NULL,
    upload_date TEXT NOT NULL DEFAULT (datetime('now')),
    FOREIGN KEY(user_id) REFERENCES users(id)
)
''')

cursor.execute('''
CREATE TABLE IF NOT EXISTS ml_predictions (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    upload_id INTEGER NOT NULL,
    result TEXT NOT NULL,
    created_at TEXT NOT NULL DEFAULT (datetime('now')),
    FOREIGN KEY(user_id) REFERENCES users(id)
)
''')

cursor.execute('''
CREATE TABLE IF NOT EXISTS reports (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER,
    file_path TEXT,
    created_at TEXT NOT NULL DEFAULT (datetime('now')),
    FOREIGN KEY(user_id) REFERENCES users(id)
)
''')

# Insert Sample Data
# Users
cursor.execute("SELECT COUNT(*) FROM Users")
if cursor.fetchone()[0] == 0:
    cursor.executemany('''
    INSERT INTO Users (name, role) VALUES (?, ?)
    ''', [
        ('Alice', 'analyst'),
        ('Bob', 'admin')
    ])
    print("Inserted sample data into Users table.")

# Business Data
cursor.execute("SELECT COUNT(*) FROM Business_Data")
if cursor.fetchone()[0] == 0:
    cursor.execute('''
    INSERT INTO Business_Data (
        Date, Product, Category, Region,
        Units_Sold, Revenue, Cost,
        Logistics_Cost, Overhead_Cost, Total_Cost,
        Net_Profit, Loss, Profit_Status, Loss_Percentage, Loss_Reason,
        Customer_Age, Gender,
        Season, Festival, Trend
    ) VALUES (
        '2024-11-10', 'Phone', 'Electronics', 'North',
        25, 75000, 50000,
        5000, 3000, 58000,
        17000, 0, 'Profit', 0, 'None',
        25, 'Male',
        'Fall', 'Diwali', 'High'
    )
    ''')
    print("Inserted sample data into Business_Data table.")

conn.commit()
conn.close()

print("Database 'business_analytics.db' setup completed successfully.")
