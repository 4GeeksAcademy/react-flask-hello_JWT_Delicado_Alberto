"""
This module takes care of starting the API Server, Loading the DB and Adding the endpoints
"""
from flask import Flask, request, jsonify, url_for, Blueprint
from api.models import db, User
from api.utils import generate_sitemap, APIException
from flask_cors import CORS
from werkzeug.security import generate_password_hash, check_password_hash
from flask_jwt_extended import create_access_token, jwt_required, get_jwt_identity
from datetime import datetime, timedelta

api = Blueprint('api', __name__)

# Allow CORS requests to this API
CORS(api, resources={
    r"/api/*": {
        "origins": ["https://effective-space-telegram-xv9647vg75vhppgr-3000.app.github.dev"],
        "methods": ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
        "allow_headers": ["Content-Type", "Authorization"],
        "supports_credentials": True
    }
})

@api.route('/signup', methods=['POST'])
def signup():
    body = request.get_json()
    
    if not body.get("email") or not body.get("password"):
        return jsonify({"error": "Faltan campos requeridos"}), 400
    
    user = User.query.filter_by(email=body["email"]).first()
    if user:
        return jsonify({"error": "El usuario ya existe"}), 400
    
    hashed_password = generate_password_hash(body["password"])
    new_user = User(
        email=body["email"],
        password=hashed_password,
        is_active=True
    )
    
    try:
        db.session.add(new_user)
        db.session.commit()
        return jsonify({"message": "Usuario creado exitosamente"}), 201
    except Exception as e:
        db.session.rollback()
        return jsonify({"error": str(e)}), 500

@api.route('/login', methods=['POST'])
def login():
    body = request.get_json()
    
    if not body.get("email") or not body.get("password"):
        return jsonify({"error": "Faltan campos requeridos"}), 400
    
    user = User.query.filter_by(email=body["email"]).first()
    
    if not user or not check_password_hash(user.password, body["password"]):
        return jsonify({"error": "Credenciales inválidas"}), 401
    
    access_token = create_access_token(
        identity=str(user.id),
        expires_delta=timedelta(hours=1)
    )
    
    return jsonify({
        "access_token": access_token,
        "user": user.serialize(),
        "token_type": "Bearer"
    }), 200

@api.route('/validate-token', methods=['GET'])
@jwt_required()
def validate_token():
    print("Headers recibidos:")
    for header, value in request.headers.items():
        print(f"{header}: {value}")
    
    try:
        current_user_id = get_jwt_identity()
        print("User ID from token:", current_user_id)
        
        user = User.query.get(int(current_user_id))
        if not user:
            print("Usuario no encontrado en la base de datos")
            return jsonify({"message": "Usuario no encontrado"}), 404
            
        user_data = user.serialize()
        print("Datos del usuario:", user_data)
        return jsonify(user_data), 200
        
    except Exception as e:
        print("Error en validate_token:", str(e))
        return jsonify({"message": str(e)}), 500

@api.route('/hello', methods=['POST', 'GET'])
def handle_hello():
    response_body = {
        "message": "Hello! I'm a message that came from the backend, check the network tab on the google inspector and you will see the GET request"
    }
    return jsonify(response_body), 200
