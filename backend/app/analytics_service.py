import random

def get_dashboard_analytics():

    return {
        "total_users": 25,
        "total_messages": 180,

        "sentiment": {
            "positive": 90,
            "neutral": 60,
            "negative": 30
        },

        "daily_messages": [
            {"date": "Mon", "count": random.randint(20, 40)},
            {"date": "Tue", "count": random.randint(20, 40)},
            {"date": "Wed", "count": random.randint(20, 40)},
            {"date": "Thu", "count": random.randint(20, 40)},
            {"date": "Fri", "count": random.randint(20, 40)},
            {"date": "Sat", "count": random.randint(20, 40)},
            {"date": "Sun", "count": random.randint(20, 40)},
        ],

        "user_activity": [
            {"hour": "10AM", "active": 5},
            {"hour": "12PM", "active": 12},
            {"hour": "3PM", "active": 20},
            {"hour": "6PM", "active": 15},
            {"hour": "9PM", "active": 8},
        ]
    }