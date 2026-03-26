import sqlite3
import os

db_path = 'business_analytics.db'
if os.path.exists(db_path):
    conn = sqlite3.connect(db_path)
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM Business_Data LIMIT 5")
    rows = cursor.fetchall()
    print("Sample Rows:", rows)
    
    cursor.execute("SELECT COUNT(*) FROM Business_Data")
    count = cursor.fetchone()[0]
    print("Total Records:", count)
    
    cursor.execute("SELECT DISTINCT Product FROM Business_Data")
    products = cursor.fetchall()
    print("All Products in DB:", [p[0] for p in products])
    
    conn.close()
else:
    print("DB file not found")
