from flask import Flask, request, jsonify
from flask_cors import CORS

from engine.tax_calculator import calculate_tax
from engine.explanation_loader import load_explanations
from engine.rule_engine import generate_rules
from engine.ai_insights import generate_ai_insights
from engine.ai_qa import answer_question

app = Flask(__name__)
app.json.ensure_ascii = False

# 🔥 REQUIRED FOR REACT ↔ FLASK
CORS(app)

# ---------------- SUMMARY BUILDER ----------------
def build_summary(mode, regime, inputs_used, applied_rules):
    used = ["Total income"]
    ignored = []
    next_steps = []

    if "standard_deduction" in applied_rules:
        used.append("Standard deduction")

    if mode == "detailed":
        if regime == "new":
            if inputs_used.get("investment_80c", 0) > 0:
                ignored.append("80C investment")
            if inputs_used.get("investment_80d", 0) > 0:
                ignored.append("80D investment")
            if inputs_used.get("hra", 0) > 0:
                ignored.append("HRA")

            if ignored:
                next_steps.append(
                    "Switch to old regime to use deductions like 80C, 80D, and HRA"
                )
        else:
            next_steps.append("Increase eligible deductions to reduce tax further")
    else:
        next_steps.append("Use detailed mode to explore tax-saving options")

    return {
        "used": used,
        "ignored": ignored,
        "next_steps": next_steps
    }


# ---------------- REGIME COMPARISON ----------------
def compare_regimes(income):
    old_tax = calculate_tax(income, "old")["total_tax"]
    new_tax = calculate_tax(income, "new")["total_tax"]

    if old_tax < new_tax:
        return {
            "old_regime_tax": old_tax,
            "new_regime_tax": new_tax,
            "recommended_regime": "old",
            "tax_saving": new_tax - old_tax,
            "reason": "Old regime allows deductions which reduce tax."
        }
    elif new_tax < old_tax:
        return {
            "old_regime_tax": old_tax,
            "new_regime_tax": new_tax,
            "recommended_regime": "new",
            "tax_saving": old_tax - new_tax,
            "reason": "New regime has lower slab rates."
        }
    else:
        return {
            "old_regime_tax": old_tax,
            "new_regime_tax": new_tax,
            "recommended_regime": "either",
            "tax_saving": 0,
            "reason": "Both regimes result in the same tax."
        }


# ---------------- STRATEGY ENGINE ----------------
def build_strategy(income, regime, inputs_used):
    if regime == "old" and inputs_used.get("investment_80c", 0) < 150000:
        return [{
            "action": "Increase investment under Section 80C",
            "tax_saved": "Depends on tax slab",
            "reason": "80C deductions reduce taxable income in the old regime"
        }]

    return [{
        "action": "No deduction-based strategy available",
        "tax_saved": 0,
        "reason": "New regime does not allow deductions"
    }]


# ---------------- TAX CALCULATION API ----------------
@app.route("/calculate-tax", methods=["POST"])
def calculate_tax_api():
    data = request.get_json()
    mode = data.get("mode", "quick")
    regime = data.get("regime", "new")

    if mode == "quick":
        income = data.get("income")
        if not income:
            return jsonify({"error": "Income required"}), 400
        result = calculate_tax(income, regime)
        inputs_used = {}

    elif mode == "detailed":
        inputs_used = {
            "basic_salary": data.get("basic_salary", 0),
            "hra": data.get("hra", 0),
            "special_allowance": data.get("special_allowance", 0),
            "bonus": data.get("bonus", 0),
            "investment_80c": data.get("investment_80c", 0),
            "investment_80d": data.get("investment_80d", 0),
        }

        income = (
            inputs_used["basic_salary"]
            + inputs_used["hra"]
            + inputs_used["special_allowance"]
            + inputs_used["bonus"]
        )

        if income <= 0:
            return jsonify({"error": "Invalid income"}), 400

        result = calculate_tax(income, regime)

    else:
        return jsonify({"error": "Invalid mode"}), 400

    # -------- COMMON RESPONSE --------
    result["total_income"] = income
    result["inputs_used"] = inputs_used
    result["mode"] = mode
    result["regime"] = regime

    result["summary"] = build_summary(
        mode, regime, inputs_used, result.get("applied_rules", [])
    )
    result["regime_comparison"] = compare_regimes(income)
    result["strategy"] = build_strategy(income, regime, inputs_used)
    result["rules"] = generate_rules(result)
    result["ai_explanation"] = generate_ai_insights(result["rules"])

    return jsonify(result)


# ---------------- ASK AI (RULE + KNOWLEDGE BASED) ----------------
@app.route("/ask-ai", methods=["POST"])
def ask_ai():
    data = request.get_json()
    question = data.get("question")
    tax_result = data.get("tax_result")

    if not question or not tax_result:
        return jsonify({"answer": "Invalid AI request"}), 400

    answer = answer_question(question, tax_result)
    return jsonify({"answer": answer})


# ---------------- RUN SERVER ----------------
if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000, debug=True)