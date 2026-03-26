import sqlite3
import os

db_path = 'business_analytics.db'
if os.path.exists(db_path):
    conn = sqlite3.connect(db_path)
    cursor = conn.cursor()
    cursor.execute("SELECT DISTINCT Product FROM Business_Data")
    results = cursor.fetchall()
    print("Products found in DB:", [r[0] for r in results])
    conn.close()
else:
    print("DB file not found")
