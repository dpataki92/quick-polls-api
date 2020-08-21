class UsersController < ApplicationController
    def create
        user = User.find_by(username: params[:username])

        if user
            
            if user.authenticate(params[:password])
            render json: {
                data: UserSerializer.new(user).to_serialized_json,
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
                    logged_in: true
                }
            else
                render json: { message: "Sorry, data validation failed :(", logged_in: false }
            end
        end
    end
end