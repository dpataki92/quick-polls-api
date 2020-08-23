class PollsController < ApplicationController
    before_action :accept_all_params

    def index
        polls = User.find_by(id: params[:id]).polls.pending_polls
        render json: PollSerializer.new(polls).to_serialized_json
    end

    def create
        poll = Poll.new(question: params[:question], )
    end

    private

    def accept_all_params
        params.permit!
    end
end
