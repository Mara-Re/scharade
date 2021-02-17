# Readme

The game Zettelchen is hosted on https://www.zettelchen.herokuapp.com/. Find an explanation of the game and its rules there or in `./src/components/Rules.tsx`

## Development setup

### Prerequisites
- node.js (I use v12.18.4)
- PostgreSQL (I use 13)

### Setup database 
Create PostgreSQL tables using code from the `.sql` files in  `./database/` 

Run PostgreSQL on port 5555 (to change to the default port 5432 or any other port, replace the port in the db url in`./database/db.js` accordingly).

### Install modules
`npm install`

### Start development servers
`node bundle-server.js`

`node index.js`

## Contributions

PRs welcome :)

 
