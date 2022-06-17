class Event::Consumer
  def self.run
    Rails.configuration.x.event_feeds.each do |event_feed|
      Rails.logger.info "Consuming events from #{event_feed.inspect}"
      begin
        xml = HTTParty.get(event_feed).body
        feed = Feedjira.parse(xml)

        feed.entries.each do |entry|
          Rails.logger.debug entry.title
        end
      rescue => error
        Rails.logger.error error
      end
    end
  end
end
