import pandas as pd
import sqlite3
import os

csv_path = 'e:/Partner/sales_dataset_500.csv'
db_path = 'e:/Partner/smartdashboard/business_analytics.db'

if os.path.exists(csv_path):
    df = pd.read_csv(csv_path)
    conn = sqlite3.connect(db_path)
    
    # Clean old data to show latest upload effect
    conn.execute("DELETE FROM Business_Data")
    
    # Map CSV columns to SQL (if needed, but pandas to_sql handles well)
    df.to_sql('Business_Data', conn, if_exists='append', index=False)
    
    print(f"Imported {len(df)} records into Business_Data.")
    conn.close()
else:
    print("CSV not found at path.")
