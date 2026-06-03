def explain_tax(result):
    explanations = []

    total_tax = result.get("total_tax", 0)
    taxable_income = result.get("taxable_income", 0)
    applied_rules = result.get("applied_rules", [])
    regime = result.get("regime", "new")

    # Zero tax case
    if total_tax == 0:
        explanations.append(
            "Your tax payable is zero because your taxable income falls below the exemption limit after applying deductions and rebates."
        )

    # Regime explanation
    if regime == "new":
        explanations.append(
            "You are taxed under the new tax regime, which offers lower tax slab rates but does not allow most deductions."
        )
    else:
        explanations.append(
            "You are taxed under the old tax regime, which allows deductions such as 80C, 80D, and HRA exemptions."
        )

    # Standard deduction
    if "standard_deduction" in applied_rules:
        explanations.append(
            "A standard deduction of ₹50,000 was applied to reduce your taxable income."
        )

    # Rebate
    if result.get("rebate_87A_applied"):
        explanations.append(
            "Rebate under Section 87A was applied, eliminating tax liability."
        )

    # Strategy hint
    strategy = result.get("strategy", [])
    if strategy:
        explanations.append(
            f"Suggested action: {strategy[0].get('action')}"
        )

    return explanations
