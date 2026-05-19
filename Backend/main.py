from fastapi import FastAPI
from Services.preprocessor import preprocessing_pipeline
from Services.jd_parser import parse_jd

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

@app.get("/parse-jd/")
def parse_jd_api():

    JD = '''
    Role- AI/ML Engineer

    years of experience- 10 to 18 years

    location- Pan India

    skills required- Deep learning, PyTorch/TensorFlow, LLM, RAG, vector DBs, APIs, MLOps, cloud, monitoring, GPU (CUDA/NVIDIA), Graph ML (Node embeddings, GNNs), ML pipelines, deployment (batch/real-time), feature stores, CI/CD, cloud, monitoring, Spark/PySpark

    Job description:

    Hands-on experience in data science and machine learning (both traditional ML and LLM-based solutions).
    Strong programming skills in Python and familiarity with libraries like PyTorch, TensorFlow, Scikit-learn, LangChain, and HuggingFace.
    Experience building APIs and deploying models with FastAPI.
    Proven experience with AWS ML stack (SageMaker, Bedrock Lambda, EKS, etc.).
    Strong understanding of AI Governance principles including compliance, security, explainability, and monitoring.
    Experience with agents, LLMs, and GenAI applications in production environments.
    Solid foundation in MLOps practices (CI/CD, versioning, monitoring, automation).
    Excellent problem-solving skills and the ability to work cross-functionally with business and engineering teams.
    '''
    result = parse_jd(JD)

    return result