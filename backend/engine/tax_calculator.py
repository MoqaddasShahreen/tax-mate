import json
import os

# Base directory of the project
BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))

def load_rules(regime: str) -> dict:
    """
    Load tax rules JSON based on regime (old/new)
    """
    if regime == "new":
        file_name = "slabs_new.json"
    else:
        file_name = "slabs_old.json"

    path = os.path.join(BASE_DIR, "rules", file_name)

    with open(path, "r", encoding="utf-8") as f:
        return json.load(f)


def calculate_tax(income: float, regime: str = "new") -> dict:
    """
    Calculate income tax for salaried individuals (AY 2024–25)
    """

    rules = load_rules(regime)

    # ---- Standard deduction (salaried only) ----
    standard_deduction = rules.get("standard_deduction", 0)
    taxable_income = max(0, income - standard_deduction)

    tax = 0.0

    # ---- Slab-wise tax calculation ----
    for slab in rules["slabs"]:
        lower = slab["min"]
        upper = slab["max"]
        rate = slab["rate"] / 100

        if taxable_income > lower:
            if upper is not None:
                taxable_amount = min(taxable_income, upper) - lower
            else:
                taxable_amount = taxable_income - lower

            tax += taxable_amount * rate

    # ---- Rebate under Section 87A ----
    rebate_applied = False
    if taxable_income <= rules["rebate_87A_limit"]:
        tax = 0.0
        rebate_applied = True

    # ---- Health & Education Cess (4%) ----
    cess = tax * 0.04
    total_tax = tax + cess

    # ---- Rule tags for explanation layer ----
    applied_rules = ["standard_deduction"]
    if rebate_applied:
        applied_rules.append("rebate_87A")

    # ---- Final structured output ----
    return {
        "gross_income": income,
        "taxable_income": taxable_income,
        "regime": regime,
        "base_tax": round(tax, 2),
        "cess": round(cess, 2),
        "total_tax": round(total_tax, 2),
        "rebate_87A_applied": rebate_applied,
        "applied_rules": applied_rules
    }


# ---- Local testing (optional, safe to keep) ----
if __name__ == "__main__":
    print(calculate_tax(650000, "new"))
    print(calculate_tax(1200000, "old"))
