import os
import tweepy
from langchain_core.tools import tool
from dotenv import load_dotenv


load_dotenv()


@tool
def post_to_twitter_tool(tweet_text: str) -> str:
    """
    Useful for posting a public safety warning draft text to Twitter/X.
    The input must be the final approved post text as a string (max 280 characters).
    """

    if os.getenv("TWITTER_MOCK_MODE") == "True":
        print("\n=== [MOCK TWITTER POST] ===")
        print(f"Content: {tweet_text}")
        print("===========================\n")
        return "Successfully posted to Twitter! [MOCK MODE] Tweet ID: 1234567890"

    client = tweepy.Client(
        consumer_key=os.getenv("TWITTER_CONSUMER_KEY"),
        consumer_secret=os.getenv("TWITTER_CONSUMER_SECRET"),
        access_token=os.getenv("TWITTER_ACCESS_TOKEN"),
        access_token_secret=os.getenv("TWITTER_ACCESS_TOKEN_SECRET"),
    )

    try:
        response = client.create_tweet(text=tweet_text)
        return f"Successfully posted to Twitter! Tweet ID: {response.data['id']}"

    except Exception as e:
        return f"ERROR posting to Twitter: {str(e)}"
