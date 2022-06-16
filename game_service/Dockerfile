FROM ruby:3.1.2-bullseye

ENV BUNDLE_JOBS=4 \
    RAILS_ENV=production \
    BINDING="0.0.0.0" \
    APP_HOME="/app/" \
    BUNDLE_PATH="/bundle" \
    PATH="/app/bin:${PATH}"

# Install all the other stuff we need, prepare folders
# and create a non-root user owning the app and gems
#
# NB: We need Vim in the image to use `rails credentials:edit`
RUN apt-get update -qq && \
    apt-get upgrade -y && \
    apt-get install -y -f vim && \
    apt-get autoremove && \
    apt-get clean && \
    rm -rf /var/lib/apt/lists/* /tmp/* /var/tmp/* && \
    useradd -m app && \
    mkdir "$APP_HOME" && \
    mkdir "$BUNDLE_PATH" && \
    chown -R app:app "$APP_HOME" "$BUNDLE_PATH" /usr/local/bundle

# Execute all commands in the app directory with the non-root user from now on
WORKDIR $APP_HOME
USER app

# Copy the Gemfile and the lockfile
COPY --chown=app:app Gemfile* .ruby-version ./

# Install the Ruby dependencies
RUN gem install bundler && \
    bundle install

# Copy all the files
COPY --chown=app:app . ./

# Expose port 3000
EXPOSE 3000

# Run the selected service
ARG service
ENV SERVICE="$service"
CMD ["/app/bin/service"]
