from fastapi import FastAPI
from Services.preprocessor import preprocessing_pipeline

app = FastAPI()



@app.get("/")
def home():

    return {
        "message": "Resume Parser API Running"
    }


@app.get("/parse-resume/")
def parse_resume_api():

    path = "pdf/Jishnu_AI_ML_Engineer_Resume.pdf"
    result = preprocessing_pipeline(path)

    return result