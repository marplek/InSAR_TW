# Dockerfile
FROM postgres:12

# Install PostGIS
RUN apt-get update \
    && apt-get install -y --no-install-recommends \
        postgis \
        postgresql-12-postgis-3 \
    && rm -rf /var/lib/apt/lists/*

# Copy configuration files and scripts
COPY postgresql.conf /etc/postgresql
COPY pg_hba.conf /etc/postgresql
COPY initdb-postgis.sh /docker-entrypoint-initdb.d/
COPY update-postgis.sh /docker-entrypoint-initdb.d/