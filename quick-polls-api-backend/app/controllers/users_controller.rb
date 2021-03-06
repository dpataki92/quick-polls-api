class UsersController < ApplicationController
    skip_before_action :authorized, only: [:create]

    def create
        user = User.find_by(username: params[:username])

        if user 
            if user.authenticate(params[:password])
                user_data = user.user_data
                user_data['token'] = encode_token(user_id: user.id)
                render json: user_data
            else
                render json: { message: "Sorry, this username is taken or you used a wrong password :(", logged_in: false }
            end
        else            
            if user = User.create(username: params[:username], password: params[:password])
                user_data = user.user_data
                user_data['token'] = encode_token(user_id: user.id)
                render json: user_data
            else
                render json: { message: "Something went wrong. Please try again.", logged_in: false }
            end
        end
    end

    def friends
        user = User.find_by(id: params[:user_id])

        if user && user.friends.size > 0
            render json: {friends: user.friends}
        else
            render json: {message: "No friends added yet."}
        end
    end

    def search_friends
        user = User.find_by(id: params[:id])
        friend = User.find_by(username: params[:friend])

        if friend
            if user.friends.include?(friend)
                render json: {message: "You are already friends with this user."}
            else
                render json: {message: "Click on the button and add #{friend.username} to your friends.", found: true}
            end
        else
            render json: {message: "We couldn't find a user with this username."}
        end
    end

    def add_friends
        user = User.find_by(id: params[:id])
        friend = User.find_by(username: params[:friend])
        user.friends << friend
        friend.friends << user

        render json: {message: "#{friend.username} has been added to our friends.", friend: friend.username}
    end

    def remove_friends
        user = User.find_by(id: params[:id])
        friend = User.find_by(username: params[:friend])

        user.friends.delete(friend)

        render json: {message: "#{friend.username} has been removed from your friends."}
    end



end