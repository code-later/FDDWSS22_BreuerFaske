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

  def players=(list_of_player)
    super if list_of_player.is_a?(Array)

    super(list_of_player.split(",").map(&:strip))
  end
end
