import sqlite3
import pandas as pd
from sklearn.model_selection import train_test_split
from sklearn.linear_model import LinearRegression
from sklearn.metrics import mean_squared_error, r2_score
import joblib

# 1. Load Data from SQLite Database
db_path = 'business_analytics.db'
conn = sqlite3.connect(db_path)
query = "SELECT * FROM Business_Data"
df = pd.read_sql_query(query, conn)
conn.close()

# 2. Data Preprocessing
print("Starting Data Preprocessing...")
# Drop any completely empty rows
df = df.dropna(how='all')

# Handle missing values for numeric columns
for col in df.select_dtypes(include=['number']).columns:
    df[col] = df[col].fillna(df[col].mean())
    
# Handle missing values for string columns using index access
for col in df.select_dtypes(include=['object']).columns:
    mode_series = df[col].mode()
    if not mode_series.empty:
        df[col] = df[col].fillna(mode_series.iloc[0])

# Encoding categorical text features
# Gender: Male = 0, Female = 1
df['Gender'] = df['Gender'].map({'Male': 0, 'Female': 1})

# Season: Spring = 0, Summer = 1, Fall = 2, Winter = 3
season_map = {'Spring': 0, 'Summer': 1, 'Fall': 2, 'Winter': 3}
df['Season'] = df['Season'].map(season_map).fillna(0) # fallback

# Festival: None = 0, Diwali = 1, Christmas = 2, etc.
festival_map = {'None': 0, 'Diwali': 1, 'Christmas': 2, 'Holi': 3, 'Eid': 4, 'New Year': 5}
df['Festival'] = df['Festival'].map(festival_map).fillna(0)

# Trend: Low = 0, Medium = 1, High = 2
trend_map = {'Low': 0, 'Medium': 1, 'High': 2}
df['Trend'] = df['Trend'].map(trend_map).fillna(1)

# Select specific input features for training based on requirement
features = ['Units_Sold', 'Cost', 'Logistics_Cost', 'Overhead_Cost', 'Customer_Age', 'Gender', 'Season', 'Festival', 'Trend']
target = 'Revenue'

# Check for unexpected types remaining
print("Encoding complete. Preparing feature set (X) and target (y)...")
X = df[features]
y = df[target]

print("Data preprocessing complete.")

# 3. Model Training
print("Splitting data into train and test sets...")
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

print("Training Linear Regression Model...")
model = LinearRegression()
model.fit(X_train, y_train)

# Evaluate simple metrics
y_pred = model.predict(X_test)
mse = mean_squared_error(y_test, y_pred)
r2 = r2_score(y_test, y_pred)
print(f"Model Evaluation - MSE: {mse:.2f}, R2 Score: {r2:.2f}")

# 4. Save the Model
print("Saving the trained model...")
joblib.dump(model, 'revenue_model.pkl')
print(f"Model saved successfully as 'revenue_model.pkl'!")

# also save the feature columns so the backend knows what to expect
joblib.dump(features, 'model_features.pkl')
