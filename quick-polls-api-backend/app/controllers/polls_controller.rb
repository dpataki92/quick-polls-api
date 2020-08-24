class PollsController < ApplicationController
    before_action :accept_all_params

    def index
        username = "user one"
        polls = User.find_by(username: username).pending_polls
        render json: PollSerializer.new(polls).to_serialized_json 
    end

    def create
        user = User.find_by(username: params[:username])
        poll = Poll.create_or_find_by(question: params[:question], period: params[:period], vote_requirement: params[:vote_requirement], creator: params[:username], status: "pending");
        if poll.period
            poll.expiration_date = poll.calc_expiration_date
            poll.save
        end

        if poll.valid?
            poll.users << user
            if params[:friends] = "all"
                user.friends.each do |f|
                    poll.users << f
                end
            else
                params[:friends].each do |f|
                    poll.users << User.find_by(username: f)
                end
            end

            params[:options].each do |o|
                Option.create(description: o, poll_id: poll.id)
            end
            render json: {message: "You have successfully created a poll with question: #{poll.question}. Click on Pending Polls to check out its data.", created: true}
        else
            render json: {message: "Sorry, invalid data. Error: #{poll.errors.messages}", created: false}
        end
    end

    private

    def accept_all_params
        params.permit!
    end
end
