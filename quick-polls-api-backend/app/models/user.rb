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
        self.polls.each do |p|
            if p.period
                if p.expiration_date <= DateTime.now
                    p.status = "closed"
                    p.save
                end
            elsif p.vote_requirement
                if p.votes.size >= p.vote_requirement
                    p.status = "closed"
                    p.save
                end
            end

        end
        self.polls
    end

    def existing_friends(poll)
        existing_friends = []
        self.friends.each do |f|
            existing_friends << f if f.polls.include?(poll)
        end
        existing_friends
    end

    def missing_friends(poll)
        missing_friends = []
        self.friends.each do |f|
            missing_friends << f if !f.polls.include?(poll)
        end
        missing_friends
    end
end
