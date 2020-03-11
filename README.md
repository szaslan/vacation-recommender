# vacation-recommender

Vacation recommender for CS 371 final project (Knowledge Representation and Reasoning).

Answer questions based on budget, interests, and current location to get a final vacation reccommendation. 

## Instructions to Start:

1. clone repo
2. cd into repo
3. run `yarn install`

- If `yarn` is not installed, view documentation how to install: https://classic.yarnpkg.com/en/docs/install

4. run `yarn start`
5. if localhost:3000 is not opened, navigate there on Chrome or your browser of choice
6. follow the steps!

## Finding Knowledge and Reasoning:

- Knowledge: Our primary knowledge source was the Wikidata knowledge base.
- Representation: To store information that we used repeatedly, such as the wikidata identifiers for US states, we wrote    
  initial queries. These identifiers were stored in global variables used throughout the project. Furthermore, the 
  user's answers to each question were stored and mapped to both wikidata identifiers and different queries through each step    
  of the project.  
- Reasoning: We wrote several SPARQL queries which built on top of each other according to the user's input. These queries can 
  be found in the file queries.js.
  
  
