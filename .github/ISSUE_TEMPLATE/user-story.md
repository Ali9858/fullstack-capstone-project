# User Story

## User Story

As a user, I want to browse and search for gifts for my home, so that I can find a suitable gift quickly and easily.

## Details and Assumptions

* The application provides a list of gifts for the home.
* Each gift contains a name, description, category, and price.
* Users can view details of an individual gift.
* Users can search for gifts by name or category.
* The application provides registration and login functionality.
* The application is accessible through the deployed frontend URL.
* Gift data is stored in MongoDB.

## Acceptance Criteria

### Scenario 1: View available gifts

Given the user opens the GiftLink application
When the main page is displayed
Then the user should see a list of available gifts for the home.

### Scenario 2: View gift details

Given the user is viewing the list of gifts
When the user selects a gift
Then the application should display the selected gift's name, description, category, and price.

### Scenario 3: Search for a gift

Given the user is on the search page
When the user enters a gift name or category
Then the application should display gifts matching the search criteria.

### Scenario 4: Register a new user

Given the user is on the registration page
When the user submits valid registration information
Then the application should create the user account and return an authentication token.

### Scenario 5: Login

Given the user has a registered account
When the user submits the correct email and password
Then the application should authenticate the user and return an authentication token.

### Scenario 6: Start using the application

Given the user opens the landing page
When the user clicks the "Начать" button
Then the application should navigate the user to the gift catalog.
