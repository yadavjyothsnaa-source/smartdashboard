import sqlite3
import pandas as pd
import pickle
import warnings
from sklearn.model_selection import train_test_split
from sklearn.linear_model import LinearRegression

# Suppress warnings for cleaner output
warnings.filterwarnings('ignore')

# 🟢 STEP 3: Load Data from SQLite
print("Loading data from database...")
conn = sqlite3.connect("business_analytics.db")
query = "SELECT * FROM Business_Data"
df = pd.read_sql_query(query, conn)
conn.close()

print("\n🔥 --- PAST ANALYSIS --- 🔥\n")

# 🟢 STEP 4: PAST ANALYSIS
# Total Revenue
print("💰 Total Revenue:", df['Revenue'].sum())

# Top Products
top_products = df.groupby('Product')['Revenue'].sum().sort_values(ascending=False)
print("\n🏆 Top Products:")
print(top_products.head())

# Region Performance
region_sales = df.groupby('Region')['Revenue'].sum()
print("\n🌍 Region Performance:")
print(region_sales)

# Monthly Trend
df['Date'] = pd.to_datetime(df['Date'])
monthly_sales = df.groupby(df['Date'].dt.to_period('M'))['Revenue'].sum()
print("\n📅 Monthly Trend:")
print(monthly_sales.head()) # printing first few to avoid completely flooding the terminal

print("\n🚀 --- FUTURE PREDICTION MODEL --- 🚀\n")

# 🟢 STEP 5: Improve Model (Time-Based Future Prediction)
df['Month'] = df['Date'].dt.month
df['Year'] = df['Date'].dt.year

# Fill missing values if any exist just to prevent crashes
df = df.dropna(subset=['Units_Sold', 'Cost', 'Month', 'Year', 'Revenue'])

X = df[['Units_Sold', 'Cost', 'Month', 'Year']]
y = df['Revenue']

X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

model = LinearRegression()
model.fit(X_train, y_train)

print(f"✅ Accuracy (R^2 Score): {model.score(X_test, y_test):.4f}")

# 🟢 STEP 6: Save Model
with open("advanced_revenue_model.pkl", "wb") as f:
    pickle.dump(model, f)
print("✅ Server model saved as: advanced_revenue_model.pkl")

# 🟢 STEP 7: Future Prediction Example
# Let's predict using the given Future Data parameters [Units_Sold, Cost, Month, Year]
future_data = pd.DataFrame([[500, 20000, 4, 2026]], columns=['Units_Sold', 'Cost', 'Month', 'Year'])

prediction = model.predict(future_data)
print(f"🔮 Example Prediction (500 units, 20k cost, April 2026) -> Future Revenue: ₹{prediction[0]:,.2f}")
