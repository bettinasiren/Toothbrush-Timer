DROP TABLE IF EXISTS avatars CASCADE;

DROP TABLE IF EXISTS users CASCADE;

DROP TABLE IF EXISTS brushing_tracker CASCADE;

DROP TABLE IF EXISTS tokens CASCADE;

CREATE TABLE
  users (
    id SERIAL PRIMARY KEY,
    username TEXT UNIQUE NOT NULL,
    password TEXT UNIQUE NOT NULL CHECK (length (password) >= 6),
    email TEXT UNIQUE NOT NULL,
    created TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  );

CREATE TABLE
  avatars (
    id SERIAL PRIMARY KEY,
    avatar TEXT,
    user_id INT,
    CONSTRAINT fk_users FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE
  );

CREATE TABLE
  brushing_tracker (
    id SERIAL PRIMARY KEY,
    user_id INT,
    brushing_session TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_users FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE
  );

CREATE TABLE
  tokens (
    user_id INT,
    token TEXT UNIQUE NOT NULL,
    CONSTRAINT fk_users FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE
  );

INSERT INTO
  avatars (avatar)
VALUES
  ('https://img.icons8.com/arcade/64/baby-yoda.png'),
  (
    'https://img.icons8.com/arcade/64/darth-vader.png'
  ),
  ('https://img.icons8.com/arcade/64/lightsaber.png'),
  ('https://img.icons8.com/arcade/64/r2-d2.png'),
  (
    'https://img.icons8.com/arcade/64/stormtrooper.png'
  );

ALTER TABLE users
ADD COLUMN avatar_id INT;

ALTER TABLE users ADD CONSTRAINT fk_avatar FOREIGN KEY (avatar_id) REFERENCES avatars (id)
-- INSERT INTO
--   medals (medal_name, medal_image, criteria)
-- VALUES
--   (
--     'first medal',
--     'https://img.icons8.com/arcade/64/prize.png',
--     'Brush teeth 5 times'
--   ),
--   (
--     'second medal',
--     'https://img.icons8.com/arcade/64/prize.png',
--     'Brush teeth 10 times'
--   ),
--   (
--     'third medal',
--     'https://img.icons8.com/arcade/64/prize.png',
--     'Brush teeth 15 times'
--   ),
--   (
--     'forth medal',
--     'https://img.icons8.com/arcade/64/prize.png',
--     'Brush teeth 20 times'
--   );
