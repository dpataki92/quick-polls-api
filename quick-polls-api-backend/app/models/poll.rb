class Poll < ApplicationRecord
    has_many :user_polls
    has_many :users, through: :user_polls

    has_many :options
    has_many :votes
    
    validates :question, presence: true
    validates :status, inclusion: { in: %w(pending closed)}

    scope :recent, -> {order(created_at: :desc)}
    scope :pending_polls, -> {where(status: "pending") }
end
