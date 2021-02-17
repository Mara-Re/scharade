DROP TABLE IF EXISTS games;

CREATE TABLE games (
    id SERIAL primary key,
    uid VARCHAR(255),
    status VARCHAR(255),
    team_explaining VARCHAR(255),
    player_explaining_id INT REFERENCES players(id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    nr_of_words_per_player INT
);
