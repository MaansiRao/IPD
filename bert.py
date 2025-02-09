import torch
from transformers import BertTokenizer, BertForSequenceClassification
import pandas as pd
from torch.nn.functional import softmax

# Load pre-trained BERT model and tokenizer
MODEL_NAME = "nlptown/bert-base-multilingual-uncased-sentiment"  # You can change this based on availability

tokenizer = BertTokenizer.from_pretrained(MODEL_NAME)
model = BertForSequenceClassification.from_pretrained(MODEL_NAME)
model.eval()

def predict_sentiment(text):
    inputs = tokenizer(text, return_tensors="pt", truncation=True, padding=True, max_length=512)
    with torch.no_grad():
        outputs = model(**inputs)
    probs = softmax(outputs.logits, dim=-1)
    predicted_class = torch.argmax(probs, dim=-1).item()
    
    # Mapping BERT output to sentiment labels (adjust as needed)
    sentiment_mapping = {0: "Negative", 1: "Negative", 2: "Neutral", 3: "Neutral", 4: "Positive"}
    return sentiment_mapping.get(predicted_class, "Neutral")

# Load dataset
data = pd.read_csv("sentiment_data.csv")  # Replace with the actual file path
data["Predicted_Label"] = data["Phrase"].apply(predict_sentiment)

# Print Phrase and Predicted_Label columns
print(data[["Phrase", "Predicted_Label"]].head())
