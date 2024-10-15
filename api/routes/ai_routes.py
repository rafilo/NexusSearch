import jwt
from flask import Blueprint, jsonify, request, Response
from uuid import uuid4
from api.ai_methods.chat import ask_question, ask_question_3, ask_question_2

ai_bp = Blueprint('ai', __name__)

@ai_bp.route("/chat", methods=["POST"])
def api_chat():
    request_json = request.get_json()
    question = request_json.get("question")
    if question is None:
        return jsonify({"msg": "Missing question from request JSON"}), 400

    session_id = request.args.get("session_id", str(uuid4()))
    permission = request_json.get("permission")
    return Response(ask_question(question, session_id, permission), mimetype="text/event-stream")

@ai_bp.route("/chat_refined", methods=["POST"])
def api_chat_refined():
    request_json = request.get_json()
    question = request_json.get("question")
    if question is None:
        return jsonify({"msg": "Missing question from request JSON"}), 400

    session_id = request.args.get("session_id", str(uuid4()))
    department = request_json.get("department")
    permission = request_json.get("permission")
    return Response(ask_question_2(question, session_id, permission), mimetype="text/event-stream")



@ai_bp.route('/upload', methods=['GET'])
def download_extracted_table():
    table_data = request.form['table_data']  # receive table data from LLM
    return
