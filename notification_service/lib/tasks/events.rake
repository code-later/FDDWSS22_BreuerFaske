namespace :events do
  task consume: :environment do
    while true
      puts "[INFO] Consuming events..."
      Event::Consumer.run

      sleep 2
    end
  end
end
