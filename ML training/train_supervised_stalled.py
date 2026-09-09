import pandas as pd
import numpy as np
from sklearn.model_selection import train_test_split
from sklearn.pipeline import Pipeline
from sklearn.impute import SimpleImputer
from sklearn.ensemble import RandomForestClassifier
from sklearn.metrics import classification_report, roc_auc_score, confusion_matrix
import warnings
warnings.filterwarnings('ignore')

print("1. Loading raw dataset...")
df = pd.read_csv(r"d:\Anant\MPLAD\DATA\MPLADS_ML_Features.csv")

# Define target
y = df['Is_Stalled']

# Drop ID columns and any target-leaking columns
cols_to_drop = ['Work_Id', 'Is_Stalled', 'Anomaly_Feature_Count']
X = df.drop(columns=[c for c in cols_to_drop if c in df.columns])

print(f"Total dataset size: {len(df)}")
print(f"Total stalled projects: {y.sum()} ({(y.sum()/len(y))*100:.2f}%)")

print("\n2. Splitting into Train and Test sets...")
# We MUST use stratify=y to ensure both train and test sets have ~9.5% stalled projects
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, stratify=y, random_state=42)

print(f"Training features shape: {X_train.shape}")
print(f"Testing features shape: {X_test.shape}")

print("\n3. Building the Supervised Pipeline...")
# Supervised Random Forests are GREAT at finding patterns in constant values.
# By filling NaNs with -999, the Random Forest can easily create a branch like:
# "If Completion_Days == -999, then probability of Stalled increases!"
pipeline = Pipeline([
    ('imputer', SimpleImputer(strategy='constant', fill_value=-999)),
    ('classifier', RandomForestClassifier(
        n_estimators=100, 
        class_weight='balanced', # Crucial for imbalanced data (10% anomalies)
        random_state=42, 
        n_jobs=-1
    ))
])

print("\n4. Training the Random Forest Classifier...")
pipeline.fit(X_train, y_train)

print("\n5. Evaluating the Model on the Holdout Test Set...")
y_pred = pipeline.predict(X_test)
y_prob = pipeline.predict_proba(X_test)[:, 1] # Probabilities for the ROC-AUC score

print("\n--- Classification Report ---")
print(classification_report(y_test, y_pred, target_names=['Active/Completed', 'Stalled']))

print("--- Confusion Matrix ---")
cm = confusion_matrix(y_test, y_pred)
print(f"True Active: {cm[0][0]} | False Stalled (False Pos): {cm[0][1]}")
print(f"False Active (Missed): {cm[1][0]} | True Stalled (Caught!): {cm[1][1]}")

auc = roc_auc_score(y_test, y_prob)
print(f"\nROC-AUC Score: {auc:.4f}")

# Let's see what features it actually used
rf_model = pipeline.named_steps['classifier']
importances = rf_model.feature_importances_
top_indices = np.argsort(importances)[::-1][:5]
print("\nTop 5 Most Important Features for Predicting 'Stalled':")
for i in top_indices:
    print(f"- {X.columns[i]}: {importances[i]:.4f}")
