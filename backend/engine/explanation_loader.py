import json
import os

# Absolute path to the explanations directory
BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
EXPLANATIONS_DIR = os.path.join(BASE_DIR, "explanations")

def load_explanations(applied_rules):
    explanations = []

    for rule in applied_rules:
        file_path = os.path.join(EXPLANATIONS_DIR, f"{rule}.json")

        if os.path.exists(file_path):
            with open(file_path, "r", encoding="utf-8") as f:
                data = json.load(f)
                explanation = data.get("explanation")

                if explanation:
                    explanations.append(explanation)

    return explanations
