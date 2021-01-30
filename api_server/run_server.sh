# Small script to run server in linux, dont forget to chmod
export FLASK_APP=api.py
export FLASK_ENV=development
pip3 install -r requirements.txt
python3 -m flask run --port=80 --host=0.0.0.0
