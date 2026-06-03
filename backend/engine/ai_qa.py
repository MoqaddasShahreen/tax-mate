print("🔥 FIXED DETERMINISTIC Q&A ACTIVE 🔥")

from engine.tax_knowledge import TAX_KNOWLEDGE

def answer_question(question, tax_result=None):
    if not question:
        return "Please ask a valid tax-related question."

    q = question.lower().strip().replace("?", "")

    for item in TAX_KNOWLEDGE:
        for key in item["keywords"]:
            if key in q:
                return item["answer"]

    return (
        "This is a tax-related question. Please ask about deductions, "
        "tax regimes, exemptions, or tax calculation."
    )