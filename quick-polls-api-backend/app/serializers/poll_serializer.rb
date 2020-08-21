class PollSerializer
 
    def initialize(poll_object)
      @poll = poll_object
    end
   
    def to_serialized_json
      @poll.to_json(:include => {
        :users => {:only => [:username]},
        :options => {:only => [:description, :id]},
        :votes => {:only => [:option_id]}
      })
    end
   
  end