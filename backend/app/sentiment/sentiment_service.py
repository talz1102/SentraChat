from app.sentiment.preprocess import clean_text
from app.sentiment.vader_engine import analyze_sentiment


def get_sentiment(text: str):
    cleaned_text = clean_text(text)
    result = analyze_sentiment(cleaned_text)
    return result