class Event < ApplicationRecord
  validates :name, presence: true
  validates :eid, presence: true, uniqueness: { case_sensitive: false }
  validates :payload, presence: true
  validates :timestamp, presence: true
end
