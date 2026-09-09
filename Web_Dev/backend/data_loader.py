import pandas as pd
import numpy as np

class DataLoader:
    def __init__(self, ml_engine):
        print("Loading in-memory dataset...")
        try:
            ml_df = pd.read_csv(r"c:\Users\Manav Motiramani\Desktop\SIH_MPLADS\ML training\MPLADS_ML_Features.csv", on_bad_lines='skip', engine='python')
            
            # Hackathon optimization using derived Anomaly outputs
            iso_scaled = ml_df['Anomaly_Feature_Count'].fillna(0) / max(1, ml_df['Anomaly_Feature_Count'].max())
            
            if 'Is_Stalled' in ml_df.columns:
                stall_prob = ml_df['Is_Stalled'] * 0.85 + np.random.uniform(0, 0.15, len(ml_df))
            else:
                stall_prob = np.zeros(len(ml_df))
                
            risk_score = np.maximum(iso_scaled, stall_prob)
            
            conditions = [
                (iso_scaled > 0.8) & (stall_prob > 0.8),
                (iso_scaled < 0.5) & (stall_prob > 0.8),
                (iso_scaled > 0.8) & (stall_prob < 0.5),
                (risk_score > 0.7),
                (risk_score > 0.4)
            ]
            choices = [
                "Critical Audit Required",
                "Systemic Delay",
                "Financial Irregularity",
                "High Priority",
                "Requires Review"
            ]
            ml_df['risk_category'] = np.select(conditions, choices, default="Healthy")
            ml_df['risk_score'] = risk_score
            ml_df['anomaly_score'] = iso_scaled
            ml_df['stall_probability'] = stall_prob
            
            self.merged = ml_df.copy()
            
            # Create synthetic text details so API is foolproof without Data parsing issues
            self.merged['sanctioned_amount'] = (np.random.rand(len(self.merged)) * 5000000).astype(int)
            self.merged['state'] = np.random.choice(["Maharashtra", "Gujarat", "Karnataka", "Delhi", "Tamil Nadu", "UP"], len(self.merged))
            self.merged['constituency'] = np.random.choice(["Central", "North", "South", "East"], len(self.merged))
            self.merged['description'] = "Infrastructure and developmental works under MPLADS scheme."
            self.merged['Work_Id'] = self.merged['Work_Id'].fillna(0).astype(int).astype(str)
            
            self.merged = self.merged.drop_duplicates(subset=['Work_Id'])
            print(f"Successfully loaded {len(self.merged)} projects into memory.")
        except Exception as e:
            print(f"Error loading datastore: {e}")
            import traceback
            traceback.print_exc()
            self.merged = pd.DataFrame()
            
    def get_stats(self):
        if self.merged.empty:
            return {"total_projects": 0, "requires_review": 0, "high_priority": 0}
            
        return {
            "total_projects": len(self.merged),
            "requires_review": len(self.merged[self.merged['risk_category'] == 'Requires Review']),
            "high_priority": len(self.merged[self.merged['risk_category'].isin(['High Priority', 'Critical Audit Required', 'Financial Irregularity'])])
        }
        
    def get_projects(self, page=1, limit=20, sort_by='risk_score', sort_asc=False):
        if self.merged.empty:
            return [], 0
            
        if sort_by not in self.merged.columns:
            sort_by = 'risk_score'
            
        df = self.merged.sort_values(by=sort_by, ascending=sort_asc)
        start = (page - 1) * limit
        end = start + limit
        
        paginated = df.iloc[start:end]
        return paginated.to_dict('records'), len(df)

    def search_projects(self, query):
        if self.merged.empty or not query:
            return []
        mask = (self.merged['Work_Id'].str.contains(query, case=False, na=False)) | \
               (self.merged['state'].str.contains(query, case=False, na=False))
        return self.merged[mask].head(20).to_dict('records')
