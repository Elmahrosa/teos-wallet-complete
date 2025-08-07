from flask import Blueprint, jsonify, request
from models.tax_report import TaxReport

tax_reporting_bp = Blueprint('tax_reporting', __name__)

@tax_reporting_bp.route('/api/tax/report', methods=['POST'])
def generate_tax_report():
    data = request.json
    user_id = data.get('user_id')
    year = data.get('year')
    # Logic to generate tax report
    report = TaxReport.generate_report(user_id, year)
    return jsonify({"message": "Tax report generated successfully", "report": report}), 201
