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
from datetime import timedelta
from collections import defaultdict
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
    
# class ParentalReport(APIView):
#     permission_classes = [IsParent]

#     def get(self, request):
#         try:
#             # data = request.body
#             # update_mock_data_csv(data) #Do not uncomment this yet
#             # Assigning categories to the dataset
#             df["Category"] = df["Phrase"].apply(categorize_phrase)

#             # Assigning time of day
#             df["Time_of_Day"] = df["Timestamp"].apply(get_time_of_day)

#             # Counting occurrences of each category by time of day
#             category_counts = df.groupby(["Time_of_Day", "Category"]).size().reset_index(name="Count")

#             # Finding the most used category for each time of day
#             most_used_category_per_time = category_counts.loc[category_counts.groupby("Time_of_Day")["Count"].idxmax()]
            
#             return Response({"status": "success", "data": most_used_category_per_time})
#         except Exception as e:
#             return Response({"status": "fail", "message": str(e)}, status=500)

class ParentalReport(APIView):
    permission_classes = [IsParent]

    def get(self, request):
        try:
            child = User.objects.get(parent=request.user, role='child')
            clicks = ButtonClick.objects.filter(user=child).select_related('button')

            if not clicks.exists():
                return Response({"status": "fail", "message": "No data found."}, status=404)

            # Group counts by time of day and category
            counts = defaultdict(lambda: defaultdict(int))

            for click in clicks:
                phrase = click.button.label
                timestamp = click.clicked_at
                category = categorize_phrase(phrase)
                time_of_day = get_time_of_day(timestamp)
                counts[time_of_day][category] += 1

            # Find the most used category for each time of day
            result = []
            for time_of_day, category_dict in counts.items():
                most_used = max(category_dict.items(), key=lambda x: x[1])
                result.append({
                    "Time_of_Day": time_of_day,
                    "Category": most_used[0],
                    "Count": most_used[1]
                })

            return Response({"status": "success", "data": result})

        except User.DoesNotExist:
            return Response({"status": "fail", "message": "No child associated with this parent."}, status=404)
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

# class EmotionTrackingReport(APIView):
#     permission_classes = [IsParent]

#     def get(self, request):
#         try:
#             data = pd.read_csv(config('SENTIMENT_DATA_CSV_FILE_PATH'))
#             data["Predicted_Label"] = data["Phrase"].apply(predict_sentiment)
#             label_counts = data["Predicted_Label"].value_counts().to_dict()
#             return Response({"status": "success", "data": label_counts})
#         except Exception as e:
#             return Response({"status": "fail", "message": str(e)}, status=500)
class EmotionTrackingReport(APIView):
    permission_classes = [IsParent]

    def get(self, request):
        try:
            # Fetch all button clicks of the child (the user in the request)
            button_clicks = ButtonClick.objects.filter(user=request.user)

            # Extract the phrases (button labels) from the button clicks
            phrases = [click.button.label for click in button_clicks]

            # Apply sentiment analysis on each phrase
            sentiment_labels = [predict_sentiment(phrase) for phrase in phrases]

            # Count the occurrences of each sentiment label
            label_counts = {sentiment: sentiment_labels.count(sentiment) for sentiment in set(sentiment_labels)}

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

#Daily Activity Pattern
class DailyActivityReport(APIView):
    permission_classes = [IsParent]

    def get(self, request):
        try:
            child = User.objects.filter(parent=request.user, role='child').first()
            if not child:
                return Response({"status": "fail", "message": "No child found for the logged-in parent"}, status=404)
            
            current_time = now()
            start_of_day = current_time.replace(hour=0, minute=0, second=0, microsecond=0)
            end_of_day = start_of_day + timedelta(days=1)

            clicks = ButtonClick.objects.filter(user=child, clicked_at__range=(start_of_day, end_of_day))

            hourly_clicks = defaultdict(int)
            for click in clicks:
                hour_slot = click.clicked_at.replace(minute=0, second=0, microsecond=0)
                hourly_clicks[hour_slot] += 1

            result = [
                {
                    "hour": hour.strftime('%H:%M'),
                    "click_count": count
                }
                for hour, count in sorted(hourly_clicks.items())
            ]
            return Response({"status": "success", "data": result})
        except Exception as e:
            return Response({"status": "fail", "message": str(e)}, status=500)
        
#Communication Success
# class CommunicatonSuccessReport(APIView):
#     permission_classes = [IsParent]

#     def get(self, request):
#         try:
#             # Assign categories and time slots
#             df["Category"] = df["Phrase"].apply(categorize_phrase)
#             df["Time_of_Day"] = df["Timestamp"].apply(get_time_of_day)

#             # Separate "Request" and "Other"
#             df["Category_Group"] = df["Category"].apply(
#                 lambda x: "Request" if x == "Request" else "Other"
#             )

#             # Count grouped by Time_of_Day and Category_Group
#             counts = df.groupby(["Time_of_Day", "Category_Group"]).size().unstack(fill_value=0).reset_index()

#             # Ensure both columns exist
#             if "Request" not in counts.columns:
#                 counts["Request"] = 0
#             if "Other" not in counts.columns:
#                 counts["Other"] = 0

#             return Response({"status": "success", "data": counts})
#         except Exception as e:
#             return Response({"status": "fail", "message": str(e)}, status=500)
class CommunicatonSuccessReport(APIView):
    permission_classes = [IsParent]

    def get(self, request):
        try:
            # Fetch the ButtonClick data for the authenticated user (child)
            button_clicks = ButtonClick.objects.filter(user=request.user)

            # List to store the processed data (for creating a DataFrame-like structure)
            data = []

            # Process each ButtonClick
            for click in button_clicks:
                phrase = click.button.label  # The phrase from the button clicked
                timestamp = click.clicked_at  # The time when the button was clicked

                # Categorize the phrase
                category = categorize_phrase(phrase)

                # Determine the time of day (morning, afternoon, evening, night)
                time_of_day = get_time_of_day(timestamp)

                # Append the data to the list
                data.append({
                    "Phrase": phrase,
                    "Category": category,
                    "Timestamp": timestamp,
                    "Time_of_Day": time_of_day
                })

            # Convert the processed data into a DataFrame (for easier manipulation)
            if not data:
                return Response({"status": "fail", "message": "No button clicks found."}, status=404)

            df = pd.DataFrame(data)

            # Separate "Request" and "Other" categories
            df["Category_Group"] = df["Category"].apply(
                lambda x: "Request" if x == "Request" else "Other"
            )

            # Count grouped by Time_of_Day and Category_Group
            counts = df.groupby(["Time_of_Day", "Category_Group"]).size().unstack(fill_value=0).reset_index()

            # Ensure both columns exist
            if "Request" not in counts.columns:
                counts["Request"] = 0
            if "Other" not in counts.columns:
                counts["Other"] = 0

            return Response({"status": "success", "data": counts.to_dict(orient="records")})

        except Exception as e:
            return Response({"status": "fail", "message": str(e)}, status=500)
