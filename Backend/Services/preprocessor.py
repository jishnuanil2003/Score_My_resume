from .pdf_parser import parse_resume
import spacy

nlp = spacy.load("en_core_web_lg")


def preprocessing_pipeline(file_path):

    resume = parse_resume(file_path)

    sections = resume["sections"]

    result = {}

    for section_name, section_content in sections.items():

        # Convert list into single string
        text = " ".join(section_content)

        doc = nlp(text.lower())

        tokens = [
            token.lemma_
            for token in doc
            if not token.is_stop
            and not token.is_punct
            and not token.is_space
        ]

        cleaned_text = " ".join(tokens)

        embedding_vector = doc.vector

        result[section_name] = {
            "embedding": embedding_vector.tolist()
        }

    return result