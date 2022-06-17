class Event < ApplicationRecord
  validates :name, presence: true
  validates :eid, presence: true, uniqueness: { case_sensitive: false }
  validates :payload, presence: true
  validates :timestamp, presence: true

  after_create :perform_action

  def perform_action
    case name
    when "UserSignedUp"
      UserMailer.with(email: payload["email"]).welcome_email.deliver_later
    end
  end
end
