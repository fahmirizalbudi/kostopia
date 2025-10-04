-- +migrate Up
-- +migrate StatementBegin

CREATE TABLE reviews (
    id SERIAL PRIMARY KEY,
    rental_id INT NOT NULL,
    rating INT NOT NULL,
    comment TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- +migrate StatementEnd

-- +migrate Down
-- +migrate StatementBegin

DROP TABLE IF EXISTS reviews;

-- +migrate StatementEnd