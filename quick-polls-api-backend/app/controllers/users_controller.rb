class UsersController < ApplicationController
    def create
        user = User.find_by(username: params[:username])

        if user
            
            if user.authenticate(params[:password])
            render json: {
                id: user.id,
                username: user.username
            }
            else
                render json: { message: "Sorry, this username is taken or you used a wrong password :(" }
            end
        else
            user = User.create(username: params[:username], password: params[:password])
            if user
                render json: {
                    id: user.id,
                    username: user.username
                }
            else
                render json: { message: "Sorry, data validation failed :(" }
            end
        end
    end
end
