class Event::Consumer
  def self.run
    Rails.configuration.x.event_feeds.each do |event_feed|
      Rails.logger.info "Consuming events from #{event_feed.inspect}"
      begin
        xml = HTTParty.get(event_feed).body
        feed = Feedjira.parse(xml)

        feed.entries.each do |entry|
          Rails.logger.debug entry.title

          next if Event.exists?(eid: entry.entry_id)

          Event.create(
            name: entry.title,
            eid: entry.entry_id,
            payload: JSON.parse(entry.content),
            timestamp: entry.updated
          )
        end
      rescue => error
        Rails.logger.error error
      end
    end
  end
end
