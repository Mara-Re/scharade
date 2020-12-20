DROP TABLE IF EXISTS games;

CREATE TABLE games (
    id SERIAL primary key,
    uid VARCHAR(255),
    status VARCHAR(255),
    team_explaining VARCHAR(255)
);


INSERT INTO games (status, uid) VALUES ('setup', 'testuid');