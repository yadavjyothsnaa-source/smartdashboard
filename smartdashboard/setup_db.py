import sqlite3
import os

db_path = 'business_analytics.db'
print(f"Setting up database at: {os.path.abspath(db_path)}")

# Connect to database
conn = sqlite3.connect(db_path)
cursor = conn.cursor()

# Create Tables
cursor.execute('''
CREATE TABLE IF NOT EXISTS Users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
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
    sender_id INTEGER,
    receiver_id INTEGER,
    message TEXT,
    timestamp DATETIME DEFAULT CURRENT_TIMESTAMP
)
''')

cursor.execute('''
CREATE TABLE IF NOT EXISTS Notifications (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER,
    message TEXT,
    status TEXT DEFAULT 'unread',
    timestamp DATETIME DEFAULT CURRENT_TIMESTAMP
)
''')

cursor.execute('''
CREATE TABLE IF NOT EXISTS Reports (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER,
    file_path TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
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
