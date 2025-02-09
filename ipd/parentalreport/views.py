import pandas as pd
import torch
from transformers import BertTokenizer, BertForSequenceClassification
from torch.nn.functional import softmax
from rest_framework.views import APIView
from decouple import config
from rest_framework.response import Response

# Load the dataset
file_path = config('MOCK_DATA_CSV_FILE_PATH')
df = pd.read_csv(file_path)
# Define categories for phrases
categories = {
    "Action": ["Please call", "I need a ride", "Can we watch a movie?", "Let's meet up", "Let's go for a walk", 
               "Time for snacks", "Can we play music?"],
    "Greeting": ["Good morning!", "Good night!", "Happy birthday!", "Happy Diwali!", "Happy Raksha Bandhan!", "Happy Monday!"],
    "Emotion": ["I'm happy", "I'm scared", "I'm bored", "I'm angry", "I'm so excited!", "I miss you", 
                "I understand", "I'm feeling sleepy", "I'm excited!"],
    "Request": ["Where's my phone?", "Can we listen to music?", "Where's the food?", "I want some sweets", 
                "I want cold drink", "I need some chai", "Where's the remote?", "Where's my coffee?", 
                "What's for lunch?", "I need a break"],
    "Love": ["I love you!", "I have a message", "I love coding!"]
}
# Function to assign a category to a phrase
def categorize_phrase(phrase):
    for category, phrases in categories.items():
        if phrase in phrases:
            return category
    return "Other"

# Function to determine the time of day
def get_time_of_day(timestamp):
    hour = int(timestamp.split()[1].split(":")[0])
    if 5 <= hour < 12:
        return "Morning"
    elif 12 <= hour < 17:
        return "Afternoon"
    elif 17 <= hour < 21:
        return "Evening"
    else:
        return "Night"
    
class ParentalReport(APIView):
    def get(self, request):
        try:
            # Assigning categories to the dataset
            df["Category"] = df["Phrase"].apply(categorize_phrase)

            # Assigning time of day
            df["Time_of_Day"] = df["Timestamp"].apply(get_time_of_day)

            # Counting occurrences of each category by time of day
            category_counts = df.groupby(["Time_of_Day", "Category"]).size().reset_index(name="Count")

            # Finding the most used category for each time of day
            most_used_category_per_time = category_counts.loc[category_counts.groupby("Time_of_Day")["Count"].idxmax()]
            
            return Response({"status": "success", "data": most_used_category_per_time})
        except Exception as e:
            return Response({"status": "fail", "message": str(e)}, status=500)
        

#Emotion tracking by sentiment analysis
tokenizer = BertTokenizer.from_pretrained(config('MODEL_NAME'))
model = BertForSequenceClassification.from_pretrained(config('MODEL_NAME'))
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

class EmotionTrackingReport(APIView):
    def get(self, request):
        try:
            data = pd.read_csv(config('SENTIMENT_DATA_CSV_FILE_PATH'))  # Replace with the actual file path in .env
            data["Predicted_Label"] = data["Phrase"].apply(predict_sentiment)
            return Response({"status": "success", "data": data[["Phrase", "Predicted_Label"]].head()})
        except Exception as e:
            return Response({"status": "fail", "message": str(e)}, status=500)