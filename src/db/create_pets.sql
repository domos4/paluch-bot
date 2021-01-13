CREATE TABLE pets
(
    "id"        SERIAL PRIMARY KEY,
    "pet_id"    VARCHAR(50) NOT NULL,
    "notified"  BOOLEAN     NOT NULL DEFAULT FALSE,
    "available" BOOLEAN     NOT NULL DEFAULT TRUE
);


truncate table pets;