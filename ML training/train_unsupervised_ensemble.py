import pandas as pd
import numpy as np
from sklearn.pipeline import Pipeline
from sklearn.impute import SimpleImputer
from sklearn.preprocessing import RobustScaler, OneHotEncoder, MinMaxScaler
from sklearn.compose import ColumnTransformer
from sklearn.ensemble import IsolationForest
from sklearn.neighbors import LocalOutlierFactor
from sklearn.metrics import classification_report, confusion_matrix
import warnings

warnings.filterwarnings('ignore')

print("1. Loading raw dataset...")
df = pd.read_csv("MPLADS_ML_Features.csv")

# Identify proxy targets and identifiers
cols_to_drop = ['Work_Id', 'Is_Stalled', 'Anomaly_Feature_Count']

# Preserve these for evaluation later
eval_df = df[cols_to_drop].copy() if all(c in df.columns for c in cols_to_drop) else None

# Prepare features
X = df.drop(columns=[c for c in cols_to_drop if c in df.columns])

print(f"Total dataset size: {len(X)}")

print("\n2. Identifying Column Types...")
# Auto-detect categorical vs numerical based on cardinality
categorical_cols = []
numerical_cols = []

for col in X.columns:
    if X[col].nunique() < 25 or X[col].dtype == 'object':
        categorical_cols.append(col)
    else:
        numerical_cols.append(col)

print(f"Detected {len(numerical_cols)} numerical features and {len(categorical_cols)} categorical features.")

print("\n3. Building Robust Preprocessing Pipeline...")
# Numerical pipeline: Median Imputer + Robust Scaler (no artificial dense clusters!)
numerical_transformer = Pipeline([
    ('imputer', SimpleImputer(strategy='median', add_indicator=True)), 
    ('scaler', RobustScaler())
])

# Categorical pipeline: Most Frequent Imputer + OneHotEncoder
categorical_transformer = Pipeline([
    ('imputer', SimpleImputer(strategy='most_frequent')),
    ('encoder', OneHotEncoder(handle_unknown='ignore', sparse_output=False))
])

preprocessor = ColumnTransformer(
    transformers=[
        ('num', numerical_transformer, numerical_cols),
        ('cat', categorical_transformer, categorical_cols)
    ],
    remainder='passthrough'
)

# Fit and transform the data
print("Processing data...")
X_processed = preprocessor.fit_transform(X)
print(f"Processed features shape: {X_processed.shape}")

print("\n4. Training Ensemble Anomaly Models...")

# Model 1: Isolation Forest
print("Training Isolation Forest (global anomalies)...")
iso_forest = IsolationForest(
    n_estimators=150,
    contamination='auto',
    random_state=42,
    n_jobs=-1
)
iso_forest.fit(X_processed)
# Get anomaly scores (higher score = more anomalous)
iso_scores = -iso_forest.score_samples(X_processed)

# Model 2: Local Outlier Factor
print("Evaluating Local Outlier Factor (local anomalies)...")
lof = LocalOutlierFactor(
    n_neighbors=20,
    contamination='auto',
    n_jobs=-1,
    novelty=False
)
lof.fit_predict(X_processed)
# Get anomaly scores (higher score = more anomalous)
lof_scores = -lof.negative_outlier_factor_


print("\n5. Blending Scores (MinMax Scaling and Averaging)...")
scaler = MinMaxScaler()
iso_scaled = scaler.fit_transform(iso_scores.reshape(-1, 1)).flatten()
lof_scaled = scaler.fit_transform(lof_scores.reshape(-1, 1)).flatten()

# Ensemble Score
ensemble_scores = (iso_scaled + lof_scaled) / 2

df['Anomaly_Score_Ensemble'] = ensemble_scores
df['Isolation_Score'] = iso_scaled
df['LOF_Score'] = lof_scaled

# Determine Top 5% as anomalous for heuristic review
threshold = np.percentile(ensemble_scores, 95)
df['Is_Anomaly_Predicted'] = (ensemble_scores >= threshold).astype(int)

num_anomalies = df['Is_Anomaly_Predicted'].sum()
print(f"\nFlagged {num_anomalies} projects ({df['Is_Anomaly_Predicted'].mean()*100:.2f}%) as anomalies.")

print("\n6. Evaluating against Heuristics (Cross-Checking)...")
if eval_df is not None and 'Is_Stalled' in eval_df.columns and 'Anomaly_Feature_Count' in eval_df.columns:
    df['Is_Stalled'] = eval_df['Is_Stalled']
    df['Anomaly_Feature_Count'] = eval_df['Anomaly_Feature_Count']
    
    # We compare with Is_Stalled. Note that Unsupervised will catch more than just stalled.
    print("\n--- Anomaly Capture vs 'Is_Stalled' proxy ---")
    print(classification_report(df['Is_Stalled'], df['Is_Anomaly_Predicted'], target_names=['Normal', 'Anomaly Flagged']))
    
    print("\n--- Anomaly Breakdown by 'Anomaly_Feature_Count' Heuristic ---")
    grouped = df.groupby('Anomaly_Feature_Count')['Is_Anomaly_Predicted'].mean() * 100
    for val, pct in grouped.items():
        if str(val) != 'nan':
            total = len(df[df['Anomaly_Feature_Count'] == val])
            print(f"Flags={int(val)} (N={total}): ML Ensemble caught {pct:.1f}%")

print("\n7. Saving top anomalies to CSV for manual review...")
anomalies_df = df[df['Is_Anomaly_Predicted'] == 1].sort_values(by='Anomaly_Score_Ensemble', ascending=False)
anomalies_df.to_csv("Flagged_Anomalies.csv", index=False)
print("Saved to 'Flagged_Anomalies.csv'. Done!")
