class PollsController < ApplicationController
    def index
        polls = User.find_by(id: params[:id]).polls.pending_polls
        render json: PollSerializer.new(polls).to_serialized_json
    end
end
