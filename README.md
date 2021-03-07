# Readme

The game Zettelchen is hosted on https://www.zettelchen.herokuapp.com/. Find an explanation of the game and its rules there or in `./src/components/Rules.tsx`

## Development setup

### Prerequisites
- node.js (I use v12.18.4)
- PostgreSQL (I use 13)

### Setup database 
Create PostgreSQL tables using code from the `.sql` files in  `./database/` 

Configure the postgres wrapper spiced-pg in `./database/db.js` to match your postgres settings:

`spicedPg(postgres:<username>:<password>@localhost:<port>/<dbname>);` 



### Install modules
`npm install`

### Start development servers
`node bundle-server.js`

`node index.js`

## Contributions

PRs welcome :)

 
