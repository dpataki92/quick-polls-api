class PollsController < ApplicationController
    before_action :accept_all_params

    def index
        polls = User.find_by(id: params[:user_id]).pending_polls.recent
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

    def vote
        poll = Poll.find_by(question: params[:question])
        user = User.find_by(id: params[:id])
        option = Option.find_by(description: params[:option])
        vote = Vote.new(poll_id: poll.id, user_id: user.id, option_id: option.id)
        
        jsonHash = {}

        if !user.votes.find {|v| v.poll_id === poll.id}
            vote.save
            calc_new_percentage(poll).each do |o_data|
                jsonHash[o_data[0]] = o_data[1]
            end

            if poll.vote_requirement
                jsonHash["message"] = "You have successfully voted on this poll! #{poll.vote_requirement - poll.votes.size} more vote(s) to close the poll."
            else
                jsonHash["message"] = "You have successfully voted on this poll!"
            end
            jsonHash["voted"] = true
        else 
            jsonHash["message"] = "You have already voted on this poll."
            jsonHash["voted"] = false
        end

        
        render json: jsonHash
    end

    def unvote
        user = User.find_by(id: params[:id])
        poll = Poll.find_by(question: params[:question])
        vote = user.votes.find {|v| v.poll_id === poll.id}
        
        jsonHash = {}

        if vote
            vote.destroy
            calc_new_percentage(poll).each do |o_data|
                jsonHash[o_data[0]] = o_data[1]
            end

            jsonHash["message"] = "You have removed your vote."
            jsonHash["unvoted"] = true
        else
            jsonHash["message"] = "You have not voted on this poll yet"
            jsonHash["unvoted"] = false
        end

        render json: jsonHash
    end

    private

    def accept_all_params
        params.permit!
    end

    def calc_new_percentage(poll)
        options_with_new_percentage = []
        poll.options.each do |o|
            poll_data = []
            poll_data[0] = o.description
            if o.votes.size === 0
                poll_data[1] = "0%"
            else
                poll_data[1] = "#{(o.votes.size.to_f / poll.votes.size.to_f * 100).floor}%"
            end
            options_with_new_percentage <<  poll_data
        end
        options_with_new_percentage
    end
end
