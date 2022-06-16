class Game < ApplicationRecord
  include SimpleUid

  enum status: {
         waiting_for_players: "waiting_for_talon",
         waiting_for_talon: "waiting_for_talon",
         running: "running",
         finished: "finished"
       }, _prefix: true

  validates :status, presence: true

  attribute :status, default: "waiting_for_players"
end
