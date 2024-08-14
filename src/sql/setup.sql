DROP TABLE IF EXISTS
    zip,
    acs_metric,
    CASCADE;

CREATE TABLE zip (
    zip_code CHAR(5) PRIMARY KEY,
    city_name TEXT NOT NULL,
    county_name TEXT NOT NULL,
    state_id CHAR(2) NOT NULL
);

CREATE TABLE acs_metric (
    id VARCHAR(20) NOT NULL,
    zip_code CHAR(5) REFERENCES zip(zip_code) ON UPDATE CASCADE ON DELETE CASCADE,
    estimate REAL,
    PRIMARY KEY (id, zip_code)
);

CREATE INDEX idx_zip_zip_code ON zip(zip_code);
CREATE INDEX idx_zip_city_name ON zip(city_name);
CREATE INDEX idx_zip_county_name ON zip(county_name);
CREATE INDEX idx_zip_state_id ON zip(state_id);
CREATE INDEX idx_acs_metric_id ON acs_metric(id);
CREATE INDEX idx_acs_metric_zip_code ON acs_metric(zip_code);
