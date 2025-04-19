# Shasta's Museum of Fine Arts (Team 2 - Section 13525)

Welcome to Shasta's Museum of Fine Arts! In this README is the explanation for installation as well as an explanation on how things are formatted. 

## Preliminary

Attached directly to the email sent is a PDF of the project report which includes information about any logins, CRUD interactions, the triggers, the reports and their subsequent queries you will find within this project. 

Furthermore, a dump of the MySQL Database is also included attached to the email, which includes the data that can be found directly on prod. 

This file will take you through the steps to running the project locally.

The GitHub is split into branches for each individual user which includes all of our work, and then the PROD branch which is directly linked to our [hosted web application](https://green-ground-0dc4ce31e.6.azurestaticapps.net/). For those interested in running locally, it is important to use the MASTER branch, as that is configured for local deployment. Attempting to run what is on PROD locally will most likely result in errors.

## Installation & Local Running
Begin by cloning the project from the repository:

```bash
git clone https://github.com/ParkerTraxler/Database-Project.git
cd Database-Project
```
The frontend and backend must be configured and built individually. We'll start with the API.

Enter the server folder and install dependencies:
```bash
cd server
npm install
```

Next, create a .env file in the server folder. This file will define configuration variables for your database connection as well as other miscellaneous configurations. Without brackets:
```
DB_HOST=[your_db_host]
DB_USER=[your_db_user]
DB_PASSWORD=[your_db_password]
DB_NAME=[your_db_name]
DB_PORT=[your_db_port]
FRONTEND_URL=[your_frontend_url] (ex: http://localhost:3000/)
JWT_SECRET=[your_jwt_secret]
PORT=[your_backend_port] (make sure this matches what port the frontend calls)
```

You can easily generate a JWT secret key with the crypto module:
```bash
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
```
Once you have defined all of your environment variables, run the API:
```bash
npm start
```
Next is the React app.

Enter the client folder and install dependencies:
```bash
cd client
npm install
```

Next, create another .env file. You will only need to define one environment variable:
```
REACT_APP_API=[your_backend_api] (ex: http://localhost:12345/)
```

Finally, run the application:
```bash
npm start
```

Note: the web application may exhibit unexpected behavior until the backend is appropriately configured and built.
