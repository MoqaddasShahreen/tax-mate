def generate_ai_insights(rules):
    insights = []

    if "ZERO_TAX" in rules:
        insights.append(
            "Your tax payable is zero because your income falls within the exemption or rebate limits."
        )

    if "LOW_EFFECTIVE_TAX" in rules:
        insights.append(
            "Your effective tax rate is very low compared to your income, indicating good tax efficiency."
        )

    if "HIGH_EFFECTIVE_TAX" in rules:
        insights.append(
            "A significant portion of your income is going towards tax, indicating a need for tax planning."
        )

    if "NEW_REGIME_BETTER" in rules:
        insights.append(
            "The new tax regime results in lower tax for you due to reduced slab rates."
        )

    if "OLD_REGIME_BETTER" in rules:
        insights.append(
            "The old tax regime is more beneficial for you because deductions significantly reduce your taxable income."
        )

    if "80C_UNUSED" in rules:
        insights.append(
            "You have not utilized Section 80C deductions, which could reduce your tax liability."
        )

    if "80C_PARTIAL" in rules:
        insights.append(
            "You have partially used Section 80C deductions. Increasing investments could lower your tax further."
        )

    if "80C_MAXED" in rules:
        insights.append(
            "You have fully utilized the Section 80C deduction limit, which is optimal for tax savings."
        )

    if "HRA_UNUSED" in rules:
        insights.append(
            "HRA benefits are not applied due to missing or zero rent details."
        )

    if "NO_DEDUCTION_ALLOWED" in rules:
        insights.append(
            "Under the new tax regime, most deductions are not applicable."
        )

    if "HIGH_SAVING_POTENTIAL" in rules:
        insights.append(
            "There is a high potential for tax savings through better deduction planning."
        )

    if not insights:
        insights.append(
            "Your tax situation is straightforward with limited optimization opportunities."
        )

    return insights