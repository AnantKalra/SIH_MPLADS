import pandas as pd
import numpy as np
import joblib
import os
from sklearn.pipeline import Pipeline
from sklearn.impute import SimpleImputer
from sklearn.preprocessing import RobustScaler, OneHotEncoder, MinMaxScaler
from sklearn.compose import ColumnTransformer
from sklearn.ensemble import IsolationForest, RandomForestClassifier
import warnings

warnings.filterwarnings('ignore')

DATA_PATH = r"c:\Users\Manav Motiramani\Desktop\SIH_MPLADS\ML training\MPLADS_ML_Features.csv"
OUT_DIR = "saved_models"
if not os.path.exists(OUT_DIR):
    os.makedirs(OUT_DIR)

print("Loading data...")
df = pd.read_csv(DATA_PATH)

# Drop target/identifier columns
cols_to_drop = ['Work_Id', 'Is_Stalled', 'Anomaly_Feature_Count']
X = df.drop(columns=[c for c in cols_to_drop if c in df.columns])
y_stalled = df['Is_Stalled'] if 'Is_Stalled' in df.columns else None

# Preprocessing
categorical_cols = [c for c in X.columns if X[c].nunique() < 25 or X[c].dtype == 'object']
numerical_cols = [c for c in X.columns if c not in categorical_cols]

num_transformer = Pipeline([
    ('imputer', SimpleImputer(strategy='median', add_indicator=True)), 
    ('scaler', RobustScaler())
])
cat_transformer = Pipeline([
    ('imputer', SimpleImputer(strategy='most_frequent')),
    ('encoder', OneHotEncoder(handle_unknown='ignore', sparse_output=False))
])
preprocessor = ColumnTransformer([
    ('num', num_transformer, numerical_cols),
    ('cat', cat_transformer, categorical_cols)
], remainder='passthrough')

print("Fitting Preprocessor...")
X_processed = preprocessor.fit_transform(X)

print("Training Isolation Forest...")
iso_forest = IsolationForest(n_estimators=100, contamination='auto', random_state=42, n_jobs=-1)
iso_forest.fit(X_processed)

iso_scores = -iso_forest.score_samples(X_processed)
scaler = MinMaxScaler()
iso_scaled = scaler.fit_transform(iso_scores.reshape(-1, 1))

print("Training Supervised Start (RF)...")
rf = Pipeline([
    ('imputer', SimpleImputer(strategy='constant', fill_value=-999)),
    ('classifier', RandomForestClassifier(n_estimators=100, class_weight='balanced', random_state=42, n_jobs=-1))
])
if y_stalled is not None:
    rf.fit(X, y_stalled)

print("Saving models...")
joblib.dump(preprocessor, os.path.join(OUT_DIR, 'preprocessor.pkl'))
joblib.dump(iso_forest, os.path.join(OUT_DIR, 'iso_forest.pkl'))
joblib.dump(scaler, os.path.join(OUT_DIR, 'score_scaler.pkl'))
joblib.dump(rf, os.path.join(OUT_DIR, 'rf_pipeline.pkl'))
joblib.dump(X.columns.tolist(), os.path.join(OUT_DIR, 'feature_columns.pkl'))

print("Done exporting models!")
