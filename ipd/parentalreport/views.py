import pandas as pd
import torch
from transformers import BertTokenizer, BertForSequenceClassification
from torch.nn.functional import softmax
from rest_framework.views import APIView
from decouple import config
from rest_framework.response import Response
from django.utils.timezone import now
import os
import json
from boards.models import *
from users.permissions import *

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
    
def update_mock_data_csv(data):
    try:
        today = now().date()

        # Load existing CSV if available
        if os.path.exists(config('MOCK_DATA_CSV_FILE_PATH')):
            df = pd.read_csv(config('MOCK_DATA_CSV_FILE_PATH'))
            df["timestamp"] = pd.to_datetime(df["timestamp"])  # Ensure timestamp is datetime
            # Remove all records with timestamps older than today
            df = df[df["timestamp"].dt.date == today]
        else:
            df = pd.DataFrame(columns=["phrase", "frequency", "timestamp"])

        # Convert incoming data into a DataFrame
        new_df = pd.DataFrame(data)

        # Ensure timestamp is stored as datetime
        new_df["timestamp"] = pd.to_datetime(new_df["timestamp"])

        # Filter out data with timestamps older than today
        new_df = new_df[new_df["timestamp"].dt.date == today]

        # Append new data
        df = pd.concat([df, new_df], ignore_index=True)

        # Save updated data to CSV
        df.to_csv(config('MOCK_DATA_CSV_FILE_PATH'), index=False)
    except Exception as e:
        raise e
    
class ParentalReport(APIView):
    permission_classes = [IsParent]

    def get(self, request):
        try:
            data = request.body
            # update_mock_data_csv(data) #Do not uncomment this yet
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
    permission_classes = [IsParent]

    def get(self, request):
        try:
            data = pd.read_csv(config('SENTIMENT_DATA_CSV_FILE_PATH'))
            data["Predicted_Label"] = data["Phrase"].apply(predict_sentiment)
            label_counts = data["Predicted_Label"].value_counts().to_dict()
            return Response({"status": "success", "data": label_counts})
        except Exception as e:
            return Response({"status": "fail", "message": str(e)}, status=500)
        
#Unique words used
class UniqueWordsReport(APIView):
    permission_classes = [IsParent]

    def get(self, request):
        try:
            child = User.objects.filter(parent=request.user, role='child').first()
            if not child:
                return Response({"status": "fail", "message": "No child found for the logged-in parent"}, status=404)
            
            unique_label_count = ButtonClick.objects.filter(user=child).values('button').distinct().count()
            return Response({"status": "success", "data": unique_label_count})
        except Exception as e:
            return Response({"status": "fail", "message": str(e)}, status=500)