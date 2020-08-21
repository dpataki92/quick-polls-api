class UserSerializer
 
    def initialize(user_object)
        @user = user_object
    end

    def to_serialized_json
        @user.to_json(:include => {
        :polls => {:only => [:id, :creator, :status]},
        :votes => {:only => [:poll_id, :option_id]},
        :friends => {:only => [:id]}
        })
    end
   
end