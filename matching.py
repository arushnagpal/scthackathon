import spacy 
from spacy.matcher import Matcher 
from spacy.attrs import *
 
# This is the part where to loads the vocabulary
nlp = spacy.load('en') 
# Creating a matcher object
matcher = Matcher(nlp.vocab) 
sentence = u"Completed my Engineering in 1876"
doc = nlp(sentence) 

patterns = {
            "year": [{'IS_DIGIT': True }],
            "is_engineering": [{"LOWER": "engineer"}]
          }

for label, pattern in patterns.items():
  matcher.add(label, None, pattern)

matches = matcher(doc) 

for match in matches:
  # match object returns a tuple with (id, startpos, endpos)
  print(doc[match[1]:match[2]])