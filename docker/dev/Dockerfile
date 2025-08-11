# syntax=docker/dockerfile:1

# Make sure RUBY_VERSION matches the Ruby version in .ruby-version
ARG RUBY_VERSION=3.4.1
FROM docker.io/library/ruby:$RUBY_VERSION-slim AS base

# Rails app lives here
WORKDIR /rails

# Install base packages and PostgreSQL 17 client
RUN apt-get update -qq && \
    apt-get install --no-install-recommends -y curl build-essential git procps gnupg lsb-release && \
    # Add PostgreSQL official APT repository
    curl -fsSL https://www.postgresql.org/media/keys/ACCC4CF8.asc | gpg --dearmor -o /usr/share/keyrings/postgresql-keyring.gpg && \
    echo "deb [signed-by=/usr/share/keyrings/postgresql-keyring.gpg] http://apt.postgresql.org/pub/repos/apt/ $(lsb_release -cs)-pgdg main" > /etc/apt/sources.list.d/postgresql.list && \
    apt-get update -qq && \
    # Install PostgreSQL 17 client and development libraries
    apt-get install --no-install-recommends -y postgresql-client-17 libpq-dev && \
    rm -rf /var/lib/apt/lists /var/cache/apt/archives

# Install Node.js for future asset builds (Vite, jsbundling, etc.)
ARG NODE_VERSION=22.13.1
ENV PATH=/usr/local/node/bin:$PATH
RUN curl -sL https://github.com/nodenv/node-build/archive/master.tar.gz | tar xz -C /tmp/ && \
    /tmp/node-build-master/bin/node-build "${NODE_VERSION}" /usr/local/node && \
    rm -rf /tmp/node-build-master

# Set development environment
ENV RAILS_ENV="development" \
    BUNDLE_PATH="/usr/local/bundle"

# Configure bundler
ENV BUNDLE_JOBS=4 \
    BUNDLE_RETRY=3

# Entrypoint script
COPY docker/dev/entrypoint.sh /usr/bin/
RUN chmod +x /usr/bin/entrypoint.sh
ENTRYPOINT ["entrypoint.sh"]

# Utility scripts
COPY docker/dev/js_routes_validate.sh /usr/local/bin/js-routes-validate
RUN chmod +x /usr/local/bin/js-routes-validate

# Start server
EXPOSE 3000
# CMD not needed when using docker compose
# CMD ["bin/rails", "server", "-b", "0.0.0.0"]
# CMD ["foreman", "start", "-f", "Procfile.dev"]
