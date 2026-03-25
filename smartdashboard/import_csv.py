import sqlite3
import csv
import os

db_path = 'business_analytics.db'
csv_path = 'business_data_20000.csv'

conn = sqlite3.connect(db_path)
cursor = conn.cursor()

# Read the CSV
print(f"Reading data from {csv_path}...")
try:
    with open(csv_path, 'r', encoding='utf-8') as f:
        reader = csv.DictReader(f)
        data = []
        
        # Check if table already has data
        cursor.execute("SELECT COUNT(*) FROM Business_Data")
        count = cursor.fetchone()[0]
        if count > 10:  # already imported
            print(f"Table already contains {count} rows. Skipping import to avoid duplicates.")
        else:
            for row in reader:
                # Need to handle potential empty fields gracefully, although assuming standard format since it's the specific dataset
                data.append((
                    row['Date'], row['Product'], row['Category'], row['Region'],
                    int(row['Units_Sold']), float(row['Revenue']), float(row['Cost']),
                    float(row['Logistics_Cost']), float(row['Overhead_Cost']), float(row['Total_Cost']),
                    float(row['Net_Profit']), float(row['Loss']), row['Profit_Status'],
                    float(row['Loss_Percentage']), row['Loss_Reason'],
                    int(row['Customer_Age']), row['Gender'],
                    row['Season'], row['Festival'], row['Trend']
                ))

            print(f"Inserting {len(data)} rows into the Business_Data table...")
            cursor.executemany('''
                INSERT INTO Business_Data (
                    Date, Product, Category, Region,
                    Units_Sold, Revenue, Cost,
                    Logistics_Cost, Overhead_Cost, Total_Cost,
                    Net_Profit, Loss, Profit_Status, Loss_Percentage, Loss_Reason,
                    Customer_Age, Gender,
                    Season, Festival, Trend
                ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            ''', data)

            conn.commit()
            print("Import successful!")
except FileNotFoundError:
    print(f"File {csv_path} not found.")

conn.close()
