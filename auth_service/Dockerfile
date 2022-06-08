FROM node:18

ENV APP_HOME="/app/" \
    BINDING="0.0.0.0" \
    PATH="/app/bin:${PATH}"

RUN useradd -m app && \
    mkdir "$APP_HOME" && \
    chown -R app:app "$APP_HOME"

# Execute all commands in the app directory with the non-root user from now on
WORKDIR $APP_HOME
USER app

# Copy the package.json and package-lock.json
COPY --chown=app:app package*.json ./

# Install NPM dependencies
RUN npm install

# Copy all the files
COPY --chown=app:app . ./

# Expose port 8080
EXPOSE 8080

# Run the selected service
ARG service
ENV SERVICE="$service"
CMD ["/app/bin/service"]
