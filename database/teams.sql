DROP TABLE IF EXISTS teams;


CREATE TABLE teams (
    id SERIAL primary key,
    team_a_or_b VARCHAR(255),
    game_uid VARCHAR(255),
    score INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
