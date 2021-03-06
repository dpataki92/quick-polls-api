class PollsController < ApplicationController
    before_action :accept_all_params

    def index
        polls = User.find_by(id: params[:user_id]).updated_polls.pending.recent
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
            if params[:friends] === "all"
                user.friends.each do |f|
                    poll.users << f
                end
            else
                params[:friends].each do |f|
                    poll.users << User.find_by(username: f)
                end
            end

            params[:options].each do |o|
                option = Option.create(description: o, poll_id: poll.id)
                poll.options << option
            end
            
            render json: {message: "You have successfully created a poll with question: #{poll.question}. Click on Pending Polls to check out its data.", created: true}
        else
            render json: {message: "Sorry, invalid data. Error: #{poll.errors.messages}", created: false}
        end
    end

    def vote
        poll = Poll.find_by(question: params[:question])
        user = User.find_by(id: params[:id])
        option = poll.options.find{|o| o.description === params[:option]}

        vote = Vote.new(poll_id: poll.id, user_id: user.id, option_id: option.id)
        
        jsonHash = {}
        
        if !user.votes.find {|v| v.poll_id === poll.id}
            vote.save
            jsonHash['new_percentage'] = poll.calc_new_percentage

            if poll.vote_requirement
                jsonHash["message"] = "You have successfully voted on this poll! #{poll.vote_requirement - poll.votes.size} more vote(s) to close the poll."
            else
                jsonHash["message"] = "You have successfully voted on this poll!"
            end
            jsonHash["voted"] = true
            jsonHash["options"] = poll.options.collect {|o| o.description}
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
            jsonHash["new_percentage"] = poll.calc_new_percentage
            jsonHash["message"] = "You have removed your vote."
            jsonHash["unvoted"] = true
            jsonHash["options"] = poll.options.collect {|o| o.description}
        else
            jsonHash["message"] = "You have not voted on this poll yet"
            jsonHash["unvoted"] = false
        end
        render json: jsonHash
    end

    def destroy
        user = User.find_by(id: params[:id])
        poll = user.polls.find {|p| p.question === params[:originalQuestion]}

        if poll && poll.creator === user.username
            poll.votes.destroy_all
            poll.destroy
            render json: {message: "You have successfully deleted this poll.", deleted: true}
        else
            render json: {message: "You are not authorized to delete this poll.", deleted: false}
        end
    end

    def close
        user = User.find_by(id: params[:id])
        poll = user.polls.find {|p| p.question === params[:originalQuestion].split("-").join(" ")}

        if poll && poll.creator === user.username
            poll.status = "closed"
            poll.save
            render json: {message: "You have successfully closed this poll.", closed: true}
        else
            render json: {message: "You are not authorized to close this poll.", closed: false}
        end
    end

    def edit
        user = User.find_by(id: params[:user_id])
        poll = user.polls.find {|p| p.question === params[:originalQuestion].split("-").join(" ")}
        
        if poll && poll.creator === user.username
            render json: {poll_id: poll.id, question: poll.question, options: poll.options, friends: user.existing_friends(poll), missing_friends: user.missing_friends(poll), period: poll.period, vote_requirement: poll.vote_requirement, edited: true}
        else
            render json: {message: "You are not authorized to edit this poll.", edited: false}
        end
    end

    def update
        poll = Poll.find_by(id: params[:poll_id])

        poll.update(question: params[:new_question], vote_requirement: params[:vote_requirement], period: params[:period])

        if poll
            poll.options.each {|o| o.destroy}
            params[:options].each do |o|
                Option.create(description: o, poll_id: poll.id)
            end

            if params[:removed_friends] === "all"
                poll.users.each do |f|
                    poll.users.delete(f) if poll.creator != f.username
                end
            else
                params[:removed_friends].each do |f|
                    poll.users.delete(User.find_by(username: f))
                end
            end
                            
            params[:friends].each do |f|
                poll.users << User.find_by(username: f)
            end

            poll.save
            render json: {message: "You have successfully updated this poll. Check out Pending Polls to see its new data.", updated: true}
        else
            render json: {message: "Sorry, update has failed.", updated: false}
        end
    end

    def closed
        user = User.find_by(id: params[:user_id])
        user.updated_polls
        closed = user.polls.recent.select {|p| p.status === "closed"}
        
        render json: PollSerializer.new(closed).to_serialized_json 
    end

    private

    def accept_all_params
        params.permit!
    end

end
