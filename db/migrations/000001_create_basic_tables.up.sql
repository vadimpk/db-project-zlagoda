CREATE TABLE IF NOT EXISTS memberships (
    id serial PRIMARY KEY,
    short_name VARCHAR(250) NOT NULL,
    description VARCHAR,
    price INT NOT NULL,
    duration VARCHAR NOT NULL
);

CREATE TABLE IF NOT EXISTS trainers (
    id serial PRIMARY KEY,
    first_name VARCHAR(250) NOT NULL,
    last_name VARCHAR(250) NOT NULL,
    email VARCHAR(250) UNIQUE NOT NULL,
    phone_number VARCHAR(250) UNIQUE NOT NULL,
    description VARCHAR(250),
    price INT NOT NULL
);

CREATE TABLE IF NOT EXISTS managers (
    id serial PRIMARY KEY,
    first_name VARCHAR(250) NOT NULL,
    last_name VARCHAR(250) NOT NULL,
    email VARCHAR(250) UNIQUE NOT NULL,
    phone_number VARCHAR(250) UNIQUE NOT NULL,
    password VARCHAR(250) NOT NULL
);

CREATE TABLE IF NOT EXISTS sessions (
    id serial PRIMARY KEY,
    refresh_token VARCHAR(250) NOT NULL,
    expires_at TIME NOT NULL,
    manager_id INT REFERENCES managers(id) ON DELETE CASCADE NOT NULL
);

CREATE TABLE IF NOT EXISTS members (
    id serial PRIMARY KEY,
    first_name VARCHAR(250) NOT NULL,
    last_name VARCHAR(250) NOT NULL,
    phone_number VARCHAR(250) UNIQUE NOT NULL,
    joined_at TIMESTAMP NOT NULL
);

CREATE TABLE IF NOT EXISTS members_memberships (
    id serial PRIMARY KEY,
    membership_id INT REFERENCES memberships(id) ON DELETE CASCADE NOT NULL,
    member_id INT REFERENCES members(id) ON DELETE CASCADE NOT NULL,
    membership_expiration TIMESTAMP NOT NULL
);

CREATE TABLE IF NOT EXISTS members_visits (
    id serial PRIMARY KEY,
    arrived_at TIMESTAMP NOT NULL,
    left_at TIMESTAMP,
    member_id INT REFERENCES members(id) ON DELETE CASCADE NOT NULL,
    manager_id INT REFERENCES managers(id) ON DELETE CASCADE NOT NULL
);

CREATE TABLE IF NOT EXISTS trainers_visits (
    id serial PRIMARY KEY,
    arrived_at TIMESTAMP NOT NULL,
    left_at TIMESTAMP,
    trainer_id INT REFERENCES trainers(id) ON DELETE CASCADE NOT NULL,
    manager_id INT REFERENCES managers(id) ON DELETE CASCADE NOT NULL
);