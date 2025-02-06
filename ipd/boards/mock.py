import os
import django
import sys

# Get the absolute path to your project directory (where manage.py is located)
PROJECT_ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))

# Add project root to Python path
sys.path.append(PROJECT_ROOT)

# Set up Django settings module
os.environ.setdefault("DJANGO_SETTINGS_MODULE", "ipd.settings")

# Initialize Django
django.setup()

# Now import models
from boards.models import Board, Button, ButtonClick
import random
from datetime import timedelta
from django.utils.timezone import now

def generate_mock_dynamic_board():
    # Step 1: Create a mock board
    board, created = Board.objects.get_or_create(
        name="Mock Dynamic Board",
        defaults={"language": "English", "description": "Test board for dynamic buttons"}
    )

    # Step 2: Define categories and sample buttons
    time_categories = ["morning", "afternoon", "evening", "night"]
    button_labels = ["Breakfast", "Lunch", "Dinner", "Exercise", "Study", "TV", "Sleep"]
    
    button_objects = []
    
    for label in button_labels:
        # Assign random categories
        assigned_categories = random.sample(time_categories, random.randint(1, 3))

        button = Button.objects.create(
            board=board,
            label=label,
            button_label=label.lower(),
            category=assigned_categories  # Assigning categories as a list
        )
        button_objects.append(button)
    
    # Step 3: Simulate button clicks over the past week
    for _ in range(30):  # 30 random button clicks
        button = random.choice(button_objects)
        click_time = now() - timedelta(days=random.randint(0, 6), hours=random.randint(6, 22))

        ButtonClick.objects.create(button=button, clicked_at=click_time)

    print(f"✅ Successfully created Mock Dynamic Board '{board.name}' with {len(button_objects)} buttons.")

# Run the function
generate_mock_dynamic_board()
