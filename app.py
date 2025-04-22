from flask import Flask, render_template

app = Flask(__name__)

@app.route('/')
def home():
    return render_template('index.html')

@app.route('/features')
def features():
    return render_template('features.html')

@app.route('/privacy-score')
def privacy_score():
    return render_template('privacy_score.html')

@app.route('/download')
def download():
    return render_template('download.html')

@app.route('/about')
def about():
    return render_template('about.html')

if __name__ == '__main__':
    #app.run(debug=True) 
    app.run(host='0.0.0.0', port=80)