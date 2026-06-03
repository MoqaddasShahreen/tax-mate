def explain_tax(result):
    explanations = []

    # Case 1: Zero tax
    if result.get("total_tax", 0) == 0:
        explanations.append(
            "Your tax payable is zero because your taxable income falls below the exemption limit after applying deductions and rebates."
        )

    # Case 2: Regime explanation
    regime = result.get("regime")
    if regime == "new":
        explanations.append(
            "You are taxed under the new tax regime, which offers lower tax slab rates but does not allow most deductions."
        )
    elif regime == "old":
        explanations.append(
            "You are taxed under the old tax regime, which allows deductions like 80C, 80D, and HRA to reduce taxable income."
        )

    # Case 3: Applied rules
    applied_rules = result.get("applied_rules", [])
    if "standard_deduction" in applied_rules:
        explanations.append(
            "A standard deduction of ₹50,000 was applied to reduce your taxable income."
        )

    # Case 4: Warnings
    for warning in result.get("warnings", []):
        explanations.append(warning)

    # Case 5: Strategy suggestions
    for strat in result.get("strategy", []):
        explanations.append(
            f"Suggested action: {strat.get('action')}."
        )

    return explanations
