# creating users
user1 = User.create(username: "user one", password_digest: BCrypt::Password.create("Iamuser1"))
user2 = User.create(username: "user two", password_digest: BCrypt::Password.create("grt4bbzb"))
user3 = User.create(username: "user three", password_digest: BCrypt::Password.create("evt4btbrz"))
user4 = User.create(username: "user four", password_digest: BCrypt::Password.create("ebrtbrteb"))
user5 = User.create(username: "user five", password_digest: BCrypt::Password.create("kojibib"))
user6 = User.create(username: "user six", password_digest: BCrypt::Password.create("fnjbnovonvn"))
user7 = User.create(username: "user seven", password_digest: BCrypt::Password.create("knofjevvb"))
user8 = User.create(username: "user eight", password_digest: BCrypt::Password.create("webtbbbew"))
user9 = User.create(username: "user nine", password_digest: BCrypt::Password.create("kmkerbrb"))
user10 = User.create(username: "user ten", password_digest: BCrypt::Password.create("kjet4bb"))
user11 = User.create(username: "user eleven", password_digest: BCrypt::Password.create("kjjbbopwrf3"))
user12 = User.create(username: "user twelve", password_digest: BCrypt::Password.create("Iamuser12"))

# creating polls
poll1 = Poll.create(question: "Who should be the president of the United States?", creator: user1.username, period: 12, status: "pending")
poll2 = Poll.create(question: "Where should we hold the next team building event?", creator: user1.username, vote_requirement: 10, status: "pending")
poll3 = Poll.create(question: "Where to go to for our dinner on Saturday?", creator: user2.username, vote_requirement: 3, period: 7, status: "pending")
poll4 = Poll.create(question: "Were you satisfied with your year-end bonus?", creator: user3.username, vote_requirement: 12, status: "pending")
poll5 = Poll.create(question: "Who was the best manager this year?", creator: user4.username, status: "pending")

poll1.expiration_date = poll1.calc_expiration_date
poll3.expiration_date = poll3.calc_expiration_date
poll1.save
poll3.save

# options for poll1
poll1_option1 = Option.create(description: "Donald Trump", poll: poll1)
poll1_option2 = Option.create(description: "Joe Biden", poll: poll1)
poll1_option3 = Option.create(description: "None of them", poll: poll1)

# options for poll2
poll2_option1 = Option.create(description: "Budapest", poll: poll2)
poll2_option2 = Option.create(description: "Bratislava", poll: poll2)
poll2_option3 = Option.create(description: "Rome", poll: poll2)
poll2_option4 = Option.create(description: "Prague", poll: poll2)

# options for poll3
poll3_option1 = Option.create(description: "Restaurant 1", poll: poll3)
poll3_option2 = Option.create(description: "Restaurant 2", poll: poll3)
poll3_option3 = Option.create(description: "Restaurant 3", poll: poll3)

# options for poll4
poll4_option1 = Option.create(description: "Not at all", poll: poll4)
poll4_option2 = Option.create(description: "Moderately", poll: poll4)
poll4_option3 = Option.create(description: "Absolutely", poll: poll4)

# options for poll5
poll5_option1 = Option.create(description: "user one", poll: poll5)
poll5_option2 = Option.create(description: "user two", poll: poll5)
poll5_option3 = Option.create(description: "user six", poll: poll5)

# make the users friends
user1.friends += [user2, user3, user4, user5, user6, user7, user8, user9]
user2.friends += [user1, user3, user4, user5, user6, user7, user8, user9]
user3.friends += [user2, user1, user4, user5, user6, user7, user8, user9]
user4.friends += [user2, user3, user1, user5, user6, user7, user8, user9]
user5.friends += [user2, user3, user4, user1, user6, user7, user8, user9]
user6.friends += [user2, user3, user4, user5, user1, user7, user8, user9]
user7.friends += [user2, user3, user4, user5, user1, user1, user8, user9]
user8.friends += [user2, user3, user4, user5, user1, user1, user1, user9]
user9.friends += [user2, user3, user4, user5, user1, user1, user8, user1]

user10.friends += [user11, user12]
user11.friends += [user10, user12]
user12.friends += [user11, user10]


# adding users to polls
Poll.all.each do |p|
    p.users += [user1, user2, user3, user4, user5, user6, user7, user8, user9]
    p.save
end

# voting by users
User.all.each do |u|
    if u.id < 10
        u.polls.each do |p|
            option = p.options[rand 0..p.options.length-1]
            Vote.create(option: option, user: u, poll: p)
        end
    end
end
