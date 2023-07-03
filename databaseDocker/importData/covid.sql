

CREATE TABLE IF NOT EXISTS public.cases
(
    fips integer,
    lat double precision,
    "long" double precision,
    daily_case integer,
    collect_date date,
    case_avg7 integer
)

CREATE TABLE IF NOT EXISTS public.population
(
    fips integer,
    pop_total integer,
    county_name character varying COLLATE pg_catalog."default",
    state_name character varying COLLATE pg_catalog."default"
)

\copy cases FROM '/mnt/dailyUS_050922.csv' DELIMITER ',' CSV HEADER;

CREATE EXTENSION postgis;
CREATE TABLE IF NOT EXISTS public.county
(
    stateid integer,
    countid integer,
    fips integer NOT NULL,
    name varchar(32),
    geom geometry,
    CONSTRAINT county_pkey PRIMARY KEY (fips)
)

