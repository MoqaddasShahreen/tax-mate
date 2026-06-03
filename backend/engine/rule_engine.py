def generate_rules(tax_result):
    rules = []

    income = tax_result.get("total_income", 0)
    taxable = tax_result.get("taxable_income", 0)
    tax = tax_result.get("total_tax", 0)
    regime = tax_result.get("regime", "new")

    cess = tax_result.get("cess", 0)
    applied = tax_result.get("applied_rules", [])
    inputs = tax_result.get("inputs_used", {})

    comparison = tax_result.get("regime_comparison", {})
    old_tax = comparison.get("old_regime_tax")
    new_tax = comparison.get("new_regime_tax")

    # ================= INCOME SEGMENTATION =================
    if income <= 250000:
        rules.append("INCOME_BELOW_EXEMPTION")
    elif income <= 500000:
        rules.append("INCOME_LOW")
    elif income <= 1000000:
        rules.append("INCOME_MIDDLE")
    elif income <= 2000000:
        rules.append("INCOME_UPPER_MIDDLE")
    else:
        rules.append("INCOME_HIGH")

    # ================= TAX BURDEN ANALYSIS =================
    if tax == 0:
        rules.append("ZERO_TAX")
    else:
        effective_rate = tax / income

        if effective_rate < 0.05:
            rules.append("LOW_EFFECTIVE_TAX")
        elif effective_rate < 0.15:
            rules.append("MODERATE_EFFECTIVE_TAX")
        else:
            rules.append("HIGH_EFFECTIVE_TAX")

    if cess > 0:
        rules.append("CESS_APPLIED")
        if cess / tax > 0.03:
            rules.append("CESS_SIGNIFICANT")

    # ================= DEDUCTION UTILIZATION =================
    if "standard_deduction" in applied:
        rules.append("STANDARD_DEDUCTION_USED")

    invest_80c = inputs.get("investment_80c", 0)
    invest_80d = inputs.get("investment_80d", 0)
    hra = inputs.get("hra", 0)
    rent = inputs.get("rent_paid", 0)

    if invest_80c == 0:
        rules.append("80C_UNUSED")
    elif invest_80c < 150000:
        rules.append("80C_PARTIAL")
    else:
        rules.append("80C_MAXED")

    if invest_80d == 0:
        rules.append("80D_UNUSED")
    else:
        rules.append("80D_USED")

    if hra > 0:
        if rent == 0:
            rules.append("HRA_UNUSED")
        else:
            rules.append("HRA_USED")

    # ================= REGIME DECISION INTELLIGENCE =================
    if old_tax is not None and new_tax is not None:
        diff = abs(old_tax - new_tax)

        if old_tax < new_tax:
            rules.append("OLD_REGIME_BETTER")
            if diff > 50000:
                rules.append("STRONG_OLD_REGIME_ADVANTAGE")
        elif new_tax < old_tax:
            rules.append("NEW_REGIME_BETTER")
            if diff > 50000:
                rules.append("STRONG_NEW_REGIME_ADVANTAGE")
        else:
            rules.append("REGIMES_EQUAL")

    # ================= STRATEGY POTENTIAL =================
    if regime == "new":
        rules.append("NO_DEDUCTION_ALLOWED")
        if income > 750000:
            rules.append("CONSIDER_OLD_REGIME")
    else:
        if invest_80c < 150000:
            rules.append("80C_EXPANSION_POSSIBLE")
        if invest_80d == 0:
            rules.append("80D_HEALTH_INSURANCE_OPPORTUNITY")

    # ================= ADVANCED TAX PLANNING SIGNALS =================
    if income > 1000000 and invest_80c < 150000:
        rules.append("HIGH_SAVING_POTENTIAL")

    if income > 2000000 and effective_rate > 0.2:
        rules.append("TAX_PLANNING_CRITICAL")

    if tax > 0 and tax / income < 0.02:
        rules.append("VERY_TAX_EFFICIENT")

    return rules