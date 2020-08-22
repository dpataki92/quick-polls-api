class UsersController < ApplicationController
    def create
        user = User.find_by(username: params[:username])

        if user
            
            if user.authenticate(params[:password])
            render json: {
                data: UserSerializer.new(user).to_serialized_json,
                winner_polls: winner_polls(user),
                loser_polls: loser_polls(user),
                polls_voted_on: polls_voted_on(user),
                added_polls: added_polls(user),
                created_polls: created_polls(user),
                pending_polls: pending_polls(user),
                closed_polls: closed_polls(user),
                logged_in: true
            }
            else
                render json: { message: "Sorry, this username is taken or you used a wrong password :(", logged_in: false }
            end
        else
            user = User.create(username: params[:username], password: params[:password])
            if user
                render json: {
                    data: UserSerializer.new(user).to_serialized_json,
                    winner_polls: winner_polls(user),
                    loser_polls: loser_polls(user),
                    polls_voted_on: polls_voted_on(user),
                    added_polls: added_polls(user),
                    created_polls: created_polls(user),
                    pending_polls: pending_polls(user),
                    closed_polls: closed_polls(user),
                    logged_in: true
                }
            else
                render json: { message: "Sorry, data validation failed :(", logged_in: false }
            end
        end
    end

    private

    def winner_polls(user)
        if user.polls.size == 0
            0
        else

            win_count = 0

            user.polls.each do |p|
                win_option = 0
                win_option_id = 0

                p.options.each do |o|
                    if o.votes.size > win_option
                        win_option = o.votes.size
                        win_option_id = o.id
                    end
                end

                if user.votes.find_by(option_id: win_option_id)
                    win_count += 1
                end
            end

            (win_count.to_f / user.polls.size.to_f * 100).round
        end
    end

    def loser_polls(user)
        if user.polls.size == 0
            0
        else
            100 - winner_polls(user)
        end
    end

    def polls_voted_on(user)
        if user.polls.size == 0
            0
        else
            ((user.votes.size.to_f / user.polls.size.to_f) * 100).round
        end
    end

    def added_polls(user)
        user.polls.select {|p| p.creator != user.username}.size
    end

    def created_polls(user)
        user.polls.size - added_polls(user)
    end

    def pending_polls(user)
        user.polls.select {|p| p.status === "pending"}.size
    end

    def closed_polls(user)
        user.polls.select {|p| p.status === "closed"}.size
    end
end