DROP TABLE IF EXISTS players;

CREATE TABLE players (
    id SERIAL primary key,
    game_uid VARCHAR(255),
    name VARCHAR(255),
    team_a_or_b VARCHAR(255)
);
