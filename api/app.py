import getpass

from dotenv import load_dotenv
from flask import Flask, request, send_file, render_template_string
from flask_cors import CORS
import os
import sys
from flask_migrate import Migrate

from api.routes.ai_routes import ai_bp
from api.routes.auth_routes import auth_bp
from api.routes.file_routes import file_bp
from api.routes.user_routes import user_bp
from api.routes.role_routes import role_bp
from api.routes.department_routes import department_bp
from utils.create_db import db

# read env, otherwise cannot append BACKEND_URL to generate_button_html in utils.py
load_dotenv()
app = Flask(__name__, static_folder="../frontend/build", static_url_path="/")
CORS(app)

app.config['SECRET_KEY'] = os.getenv('SECRET_KEY')

app.config["SQLALCHEMY_DATABASE_URI"] = os.getenv('DATABASE_URI')
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False


def _set_env(var: str):
    if not os.environ.get(var):
        os.environ[var] = getpass.getpass(f"Please enter {var}: ")


_set_env("LANGSMITH_API_KEY")
os.environ["LANGCHAIN_TRACING_V2"] = "true"
os.environ["LANGCHAIN_PROJECT"] = "LangGraph Tutorial"

db.init_app(app)
migrate = Migrate(app, db)


@app.cli.command()
def create_index():
    """Create or re-create the Elasticsearch index."""
    basedir = os.path.abspath(os.path.dirname(__file__))
    sys.path.append(f"{basedir}/../")

    from data import index_data

    index_data.main()


@app.cli.command()
def add_index_data():
    """Add financial data to the Elasticsearch index."""
    basedir = os.path.abspath(os.path.dirname(__file__))
    sys.path.append(f"{basedir}/../")

    from data import add_index_data

    add_index_data.main()


@app.route("/")
def api_index():
    return app.send_static_file("index.html")


app.register_blueprint(auth_bp, url_prefix='/api')
app.register_blueprint(ai_bp, url_prefix='/api')
app.register_blueprint(user_bp, url_prefix='/api')
app.register_blueprint(role_bp, url_prefix='/api')
app.register_blueprint(department_bp, url_prefix='/api')
app.register_blueprint(file_bp, url_prefix='/api')

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=3001, debug=True)
