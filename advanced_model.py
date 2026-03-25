import pandas as pd
from sklearn.ensemble import RandomForestRegressor
from sklearn.metrics import r2_score
import joblib
import os

def train_model(df, target_col="Revenue"):
    # Clean Data
    df = df.dropna(subset=[target_col])
    
    # Extract date features if 'Date' exists
    if 'Date' in df.columns:
        df['Date'] = pd.to_datetime(df['Date'])
        df['Month'] = df['Date'].dt.month
        df['Year'] = df['Date'].dt.year
        df = df.drop("Date", axis=1)

    # Convert categorical -> numbers
    df = pd.get_dummies(df, drop_first=True)

    # Separate features and target
    X = df.drop(target_col, axis=1)
    y = df[target_col]

    # Train model
    model = RandomForestRegressor(n_estimators=100, random_state=42)
    model.fit(X, y)

    # Calculate Accuracy (R^2 for regression)
    accuracy = r2_score(y, model.predict(X))

    # Feature Importance
    importances = model.feature_importances_
    top_features = sorted(zip(X.columns, importances), key=lambda x: x[1], reverse=True)[:3]
    top_feature_names = [f[0] for f in top_features]

    # Save Model
    joblib.dump(model, "advanced_revenue_model.pkl")

    return model, accuracy, top_feature_names

def predict(model, input_df):
    # Ensure columns match (dummy alignment)
    # For a real pipeline, we'd save the columns during training.
    # Here we assume the input_df has been similarly processed.
    return model.predict(input_df)
