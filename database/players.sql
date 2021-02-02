DROP TABLE IF EXISTS players CASCADE;

CREATE TABLE players (
    id SERIAL primary key,
    game_uid VARCHAR(255),
    name VARCHAR(255),
    team_a_or_b VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    enter_words_completed BOOLEAN DEFAULT false
);
