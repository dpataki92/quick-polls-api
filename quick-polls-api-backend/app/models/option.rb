class Option < ApplicationRecord
    belongs_to :poll
    has_many :users, through: :polls
    has_many :votes

    validates :description, presence: true
end
