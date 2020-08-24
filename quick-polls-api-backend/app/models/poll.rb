class Poll < ApplicationRecord
    has_many :user_polls
    has_many :users, through: :user_polls

    has_many :options
    has_many :votes
    
    validates :question, presence: true, allow_blank: false
    validates :status, inclusion: { in: %w(pending closed)}
    validates :end_date, numericality: { only_integer: true }
    validates :vote_requirement, numericality: { only_integer: true}

    scope :recent, -> {order(created_at: :desc)}
    scope :pending_polls, -> {where(status: "pending") }
end
