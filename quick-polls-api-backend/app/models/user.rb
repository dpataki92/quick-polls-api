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

    def pending_polls_array
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

    def user_data
        {
            data: UserSerializer.new(self).to_serialized_json,
            winner_polls: self.winner_polls,
            loser_polls: self.loser_polls,
            polls_voted_on: self.polls_voted_on,
            added_polls: self.added_polls,
            created_polls: self.created_polls,
            pending_polls: self.pending_polls,
            closed_polls: self.closed_polls,
            logged_in: true
        }
    end

    def winner_polls
        if self.polls.size == 0
            0
        else
            win_count = 0

            self.polls.each do |p|
                win_option = 0
                win_option_id = 0

                p.options.each do |o|
                    if o.votes.size > win_option
                        win_option = o.votes.size
                        win_option_id = o.id
                    end
                end

                if self.votes.find_by(option_id: win_option_id)
                    win_count += 1
                end
            end

            (win_count.to_f / self.polls.size.to_f * 100).round
        end
    end

    def loser_polls
        if self.polls.size == 0
            0
        else
            100 - winner_polls
        end
    end

    def polls_voted_on
        if self.polls.size == 0
            0
        else
            ((self.votes.size.to_f / self.polls.size.to_f) * 100).round
        end
    end

    def added_polls
        self.polls.select {|p| p.creator != self.username}.size
    end

    def created_polls
        self.polls.size - added_polls
    end

    def pending_polls
        self.polls.select {|p| p.status === "pending"}.size
    end

    def closed_polls
        self.polls.select {|p| p.status === "closed"}.size
    end
end
