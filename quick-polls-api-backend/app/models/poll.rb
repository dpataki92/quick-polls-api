class Poll < ApplicationRecord
    has_many :user_polls
    has_many :users, through: :user_polls

    has_many :options
    has_many :votes
    
    validates :question, presence: true, allow_blank: false
    validates :question, uniqueness: true
    validates :status, inclusion: { in: %w(pending closed)}
    validates :period, numericality: { only_integer: true, allow_blank: true }
    validates :vote_requirement, numericality: { only_integer: true, allow_blank: true}

    scope :recent, -> {order(created_at: :desc)}
    scope :pending, -> {where(status: "pending") }
    scope :closed, -> {where(status: "closed") }

    def calc_expiration_date
        self.created_at + 86400 * self.period
    end
end
