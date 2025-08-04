"""
This module takes care of starting the API Server, Loading the DB and Adding the endpoints
"""
from flask import Flask, request, jsonify, url_for, Blueprint, current_app
from api.models import db, User
from api.utils import generate_sitemap, APIException
from flask_cors import CORS
from werkzeug.security import generate_password_hash, check_password_hash
import jwt
import datetime
from functools import wraps

api = Blueprint('api', __name__)

# Allow CORS requests to this API
CORS(api)


@api.route('/hello', methods=['POST', 'GET'])
def handle_hello():

    response_body = {
        "message": "Hello! I'm a message that came from the backend, check the network tab on the google inspector and you will see the GET request"
    }

    return jsonify(response_body), 200


@api.route('/signup', methods=['POST'])
def signup():
    data = request.get_json()
    email = data.get('email')
    password = data.get('password')

    if not email or not password:
        return jsonify({"msg": "Faltan datos"}), 400

    user = User.query.filter_by(email=email).first()
    if user:
        return jsonify({"msg": "Usuario ya existe"}), 409

    hashed_password = generate_password_hash(password)
    new_user = User(email=email, password=hashed_password, is_active=True)

    db.session.add(new_user)
    db.session.commit()

    return jsonify({"msg": "Usuario creado"}), 201


@api.route('/login', methods=['POST'])
def login():
    data = request.get_json()
    email = data.get('email')
    password = data.get('password')

    if not email or not password:
        return jsonify({"msg": "Faltan datos"}), 400

    user = User.query.filter_by(email=email).first()

    if not user or not check_password_hash(user.password, password):
        return jsonify({"msg": "Credenciales incorrectas"}), 401

    token = jwt.encode({
        'user_id': user.id,
        'exp': datetime.datetime.utcnow() + datetime.timedelta(hours=1)
    }, current_app.config['FLASK_APP_KEY'], algorithm='HS256')

    return jsonify({"token": token})


def token_required(f):
    @wraps(f)
    def decorated(*args, **kwargs):
        token = None

        if 'Authorization' in request.headers:
            auth_header = request.headers['Authorization']
            if auth_header.startswith('Bearer '):
                token = auth_header.split(' ')[1]

        if not token:
            return jsonify({'msg': 'Token es requerido'}), 401

        try:
            data = jwt.decode(
                token, current_app.config['FLASK_APP_KEY'], algorithms=['HS256'])
            current_user = User.query.get(data['user_id'])
            if not current_user:
                return jsonify({'msg': 'Usuario no encontrado'}), 401
        except jwt.ExpiredSignatureError:
            return jsonify({'msg': 'Token expirado'}), 401
        except jwt.InvalidTokenError:
            return jsonify({'msg': 'Token inválido'}), 401

        return f(current_user, *args, **kwargs)
    return decorated


@api.route('/private', methods=['GET'])
@token_required
def private(current_user):
    return jsonify({
        "msg": f"Hola {current_user.email}, estás en una ruta privada"
    })
