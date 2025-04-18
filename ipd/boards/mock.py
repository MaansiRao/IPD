# import os
# import django
# import sys

# # Setup Django
# PROJECT_ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
# sys.path.append(PROJECT_ROOT)
# os.environ.setdefault("DJANGO_SETTINGS_MODULE", "ipd.settings")
# django.setup()

from boards.models import DefaultBoard, DefaultButton

# Ensure you define 'board' first
board, created = DefaultBoard.objects.get_or_create(name="Default Board",language="English")

defaultPhrases = [
     {"icon": "Coffee", "label": "I need some chai", "button_label": "Chai", "color": "text-blue-500"},
    {"icon": "Utensils", "label": "I want to eat", "button_label": "Eat", "color": "text-green-600"},
    {"icon": "Home", "label": "I want to go home", "button_label": "Home", "color": "text-purple-600"},
    {"icon": "Sun", "label": "Good morning!", "button_label": "Morning", "color": "text-yellow-500"},
    {"icon": "Moon", "label": "Good night!", "button_label": "Night", "color": "text-blue-800"},
    {"icon": "Smile", "label": "How are you?", "button_label": "How", "color": "text-indigo-500"},
    {"icon": "Music", "label": "Can we play music?", "button_label": "Music", "color": "text-pink-500"},
    {"icon": "Book", "label": "I want to read", "button_label": "Read", "color": "text-orange-500"},
    {"icon": "Tv", "label": "Let's watch TV", "button_label": "TV", "color": "text-blue-600"},
    {"icon": "Heart", "label": "I love you!", "button_label": "Love", "color": "text-red-500"},
    {"icon": "Smile", "label": "I'm happy", "button_label": "Happy", "color": "text-yellow-600"},
    {"icon": "Phone", "label": "Please call", "button_label": "Call", "color": "text-green-500"},
    {"icon": "Mail", "label": "I have a message", "button_label": "Message", "color": "text-blue-500"},
    {"icon": "Car", "label": "I need a ride", "button_label": "Ride", "color": "text-gray-600"},
    {"icon": "Gift", "label": "Thank you!", "button_label": "Thanks", "color": "text-teal-500"},
    {"icon": "Smile", "label": "You're welcome", "button_label": "Welcome", "color": "text-indigo-500"},
    {"icon": "AlertTriangle", "label": "Please help", "button_label": "Help", "color": "text-red-500"},
    {"icon": "Smile", "label": "I understand", "button_label": "Understand", "color": "text-green-500"},
    {"icon": "Smile", "label": "Nice to meet you", "button_label": "Meet", "color": "text-indigo-500"},
    {"icon": "Moon", "label": "I'm tired", "button_label": "Tired", "color": "text-purple-500"},
    {"icon": "Tv", "label": "Can we watch a movie?", "button_label": "Movie", "color": "text-blue-600"},
    {"icon": "Frown", "label": "I'm sad", "button_label": "Sad", "color": "text-indigo-500"},
    {"icon": "Home", "label": "I need rest", "button_label": "Rest", "color": "text-purple-600"},
    {"icon": "Coffee", "label": "I want cold drink", "button_label": "Drink", "color": "text-blue-500"},
    {"icon": "Volleyball", "label": "Let's play football", "button_label": "Football", "color": "text-green-500"},
    {"icon": "Meh", "label": "I'm bored", "button_label": "Bored", "color": "text-red-500"},
    {"icon": "Gift", "label": "Surprise?", "button_label": "Surprise", "color": "text-yellow-500"},
    {"icon": "Angry", "label": "I'm angry", "button_label": "Angry", "color": "text-indigo-500"},
    {"icon": "ShoppingBag", "label": "Can we go shopping?", "button_label": "Shopping", "color": "text-pink-500"},
    {"icon": "Laugh", "label": "That's so funny!", "button_label": "Funny", "color": "text-purple-600"},
    {"icon": "Sparkles", "label": "Happy Diwali!", "button_label": "Diwali", "color": "text-yellow-500"},
    {"icon": "Cake", "label": "Happy birthday!", "button_label": "Birthday", "color": "text-pink-500"},
    {"icon": "Frown", "label": "I miss you", "button_label": "Miss", "color": "text-red-600"},
     {"icon": "PartyPopper", "label": "Let's celebrate!", "button_label": "Celebrate", "color": "text-orange-500"},
    {"icon": "Flower", "label": "Happy Raksha Bandhan", "button_label": "Rakhi", "color": "text-purple-600"},
    {"icon": "Drum", "label": "Let's dance!", "button_label": "Dance", "color": "text-indigo-500"},
    {"icon": "Soup", "label": "Can we have biryani?", "button_label": "Biryani", "color": "text-green-500"},
    {"icon": "PartyPopper", "label": "Party time!", "button_label": "Party", "color": "text-blue-500"},
    {"icon": "Phone", "label": "Let's video call", "button_label": "Video", "color": "text-yellow-600"},
    {"icon": "CandyCane", "label": "Happy Christmas!", "button_label": "Christmas", "color": "text-green-600"},
    {"icon": "Present", "label": "Here is a gift", "button_label": "Gift", "color": "text-red-500"},
    {"icon": "SmilePlus", "label": "Let's see fireworks", "button_label": "Fireworks", "color": "text-teal-500"},
    {"icon": "Pizza", "label": "I want pizza", "button_label": "Pizza", "color": "text-orange-500"},
    {"icon": "Trophy", "label": "I won!", "button_label": "Won", "color": "text-purple-500"},
    {"icon": "Headphones", "label": "I need headphones", "button_label": "Headphones", "color": "text-blue-800"},
    {"icon": "AlertTriangle", "label": "I'm scared", "button_label": "Scared", "color": "text-indigo-500"},
    {"icon": "Moon", "label": "Happy Eid!", "button_label": "Eid", "color": "text-green-800"},
    {"icon": "PaintBucket", "label": "Happy Holi!", "button_label": "Holi", "color": "text-pink-500"},
    
]

# Create Buttons based on the phrases
for phrase in defaultPhrases:
    DefaultButton.objects.get_or_create(
        board=board,
        label=phrase["label"],
        button_label=phrase["button_label"],
        icon=phrase["icon"],
        category=[phrase["color"]],
    )

print(f"Added {len(defaultPhrases)} default buttons to board: {board.name}")
