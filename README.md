# zipnote-server

Zipnote server REST API

A node.js application using Express that allows users to create personalized notes. 

Uses Sequelize to connect to MySQL database.


### Features
- User sign up using email & password
- Authenticated / Secure routes using JWT
- Multi-tenancy, users only see their own notes
- Notes:
  - List all notes (filter by name, pagination)
  - Create new note
  - Update an existing note
  - View note
  - Delete a note

### API ENDPOINTS
##### Auth
`POST v1/auth/signup` Signup for service endpoint

`POST v1/auth/login` Login endpoint

##### Notes
`GET v1/notes` List all notes

`GET v1/notes/{id}` Get note details with ID

`POST v1/notes` Create a new note

`PUT v1/notes/{id}` Update a note by ID

`DELETE v1/notes/{id}` Delete a note by ID

### Main Libraries & Tools
- Express
- Sequelize
- Bcrypt
- Jsonwebtoken
- Helmet
