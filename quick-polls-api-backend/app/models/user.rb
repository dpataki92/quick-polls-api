class User < ApplicationRecord
    has_secure_password

    has_many :user_polls
    has_many :polls, through: :user_polls

    has_and_belongs_to_many :friends,
                          :class_name => "User",
                          :join_table => "user_friends",
                          :foreign_key => "user_id",
                          :association_foreign_key => "friend_id"

    
    has_many :options, through: :polls
    has_many :votes

    validates :username, presence: true

    def pending_polls
        day = 86400

        self.polls.each do |p|
            if p.end_date
                expiration_date = p.created_at + day * p.end_date
                if expiration_date >= p.created_at
                    p.status = "closed"
                end
            elsif p.vote_requirement
                if p.votes.size >= p.vote_requirement
                    p.status = "closed"
                end
            end

        end
        
        self.polls.pending
    end
end
