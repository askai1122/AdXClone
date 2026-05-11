# pip install firecrawl-py
from firecrawl import Firecrawl

app = Firecrawl(api_key="fc-acfbc6ddd8b74b49bd15af6a54c9d9ba")

# Scrape a website:
doc = app.scrape("https://www.premierdentalofnashville.com")
print(doc)