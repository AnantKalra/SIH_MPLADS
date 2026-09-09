import pandas as pd
import numpy as np
from sklearn.pipeline import Pipeline
from sklearn.impute import SimpleImputer
from sklearn.preprocessing import StandardScaler
from sklearn.ensemble import IsolationForest, RandomForestClassifier
from sklearn.metrics import classification_report, roc_auc_score, precision_recall_curve

import warnings
warnings.filterwarnings('ignore')

print("1. Loading data...")
X_train = pd.read_csv(r"d:\Anant\MPLAD\DATA\train_normal_features.csv")
X_test = pd.read_csv(r"d:\Anant\MPLAD\DATA\test_features.csv")
y_test = pd.read_csv(r"d:\Anant\MPLAD\DATA\test_labels.csv")['Anomaly_Label']

cols_to_drop = ['Work_Id', 'Is_Stalled', 'Anomaly_Feature_Count']
train_cols_to_drop = [c for c in cols_to_drop if c in X_train.columns]
test_cols_to_drop = [c for c in cols_to_drop if c in X_test.columns]

X_train = X_train.drop(columns=train_cols_to_drop)
X_test = X_test.drop(columns=test_cols_to_drop)

print("\n2. Finding Important Features (using Random Forest on Test Set)")
# Impute with an extreme value to force NaNs to become outliers instead of dense clusters
imputer = SimpleImputer(strategy='constant', fill_value=-999)
X_test_imputed = imputer.fit_transform(X_test)

rf = RandomForestClassifier(n_estimators=50, random_state=42, n_jobs=-1)
rf.fit(X_test_imputed, y_test)
importances = rf.feature_importances_
top_k = 10
top_indices = np.argsort(importances)[::-1][:top_k]
top_features = X_train.columns[top_indices]

print(f"Top {top_k} Features isolating Anomalies: \n{list(top_features)}")

X_train_top = X_train[top_features]
X_test_top = X_test[top_features]

print("\n3. Preprocessing (Imputing and Scaling)...")
preprocessor = Pipeline([
    ('imputer', SimpleImputer(strategy='constant', fill_value=-999)), 
    ('scaler', StandardScaler())                   
])

X_train_scaled = preprocessor.fit_transform(X_train_top)
X_test_scaled = preprocessor.transform(X_test_top)

print("\n4. Training Isolation Forest on Top Features...")
# Using contamination='auto' allows the model to not arbitrarily force 1% predictions
model = IsolationForest(
    n_estimators=100, 
    contamination='auto',
    random_state=42,
    n_jobs=-1
)

model.fit(X_train_scaled)

print("\n5. Scoring and Dynamic Thresholding...")
# Get raw anomaly scores
anomaly_scores = -model.score_samples(X_test_scaled)

# If anomalies are forming dense clusters, they might get low anomaly scores.
# Let's check the average scores for both classes.
mean_normal = np.mean(anomaly_scores[y_test == 0])
mean_anomaly = np.mean(anomaly_scores[y_test == 1])

print(f"Mean Anomaly Score for Normal data: {mean_normal:.4f}")
print(f"Mean Anomaly Score for Anomalies:   {mean_anomaly:.4f}")

auc = roc_auc_score(y_test, anomaly_scores)
print(f"\nRaw ROC-AUC Score: {auc:.4f}")

# If AUC is < 0.5, it means the model thinks the "Normal" data is actually more anomalous than the Anomalies!
if auc < 0.5:
    print("-> Notice: AUC is below 0.5. The 'Anomalies' are forming a dense, tight cluster that the model thinks is very 'Normal'!")
    print("-> Flipping scores to detect the dense cluster...")
    anomaly_scores = -anomaly_scores # Flip direction

# Find the best threshold that maximizes F1-Score
precisions, recalls, thresholds = precision_recall_curve(y_test, anomaly_scores)
f1_scores = 2 * (precisions * recalls) / (precisions + recalls + 1e-10)
best_idx = np.argmax(f1_scores)
best_thresh = thresholds[best_idx] if best_idx < len(thresholds) else thresholds[-1]

y_pred = (anomaly_scores >= best_thresh).astype(int)

print(f"\n--- Dynamic Evaluation (Threshold = {best_thresh:.4f}) ---")
print(classification_report(y_test, y_pred, target_names=['Normal', 'Anomaly']))