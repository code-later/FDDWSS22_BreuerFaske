module SimpleUid
  extend ActiveSupport::Concern

  class_methods do
    def by_uid(uid_with_slug)
      by_uid!(uid_with_slug)
    rescue ActiveRecord::RecordNotFound
      nil
    end

    def by_uid!(uid_with_slug)
      find_by!(slug: uid_with_slug)
    end
  end

  included do
    validates :uid, presence: true

    before_validation :generate_uid
  end

  def generate_uid
    self[:uid] ||= SecureRandom.hex(6)
  end

  def to_param
    slug
  end
end
