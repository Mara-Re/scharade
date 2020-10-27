CREATE TABLE teams (
    id SERIAL primary key,
    team_1_or_2 VARCHAR(255),
    game_uid VARCHAR(255),
    score INTEGER DEFAULT 0
);
