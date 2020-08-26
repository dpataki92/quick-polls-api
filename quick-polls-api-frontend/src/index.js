const BASE_URL = "http://localhost:3000"
const USER_URL = `${BASE_URL}/users`

document.addEventListener("DOMContentLoaded", () => {
    logIn()
})

// creates login form
function createLoginForm() {
    document.querySelector(".main").style.display = "none";
  
    let div = document.createElement("div");
    div.id = "loginForm";
    div.style.textAlign ="center";
    div.style.marginTop = "100px"
  
    let title = document.createElement("h2");
    title.innerText = "Quick polls";
    title.style.display = "inline-block";
    title.style.marginLeft = "5px";
    let img = document.createElement("img");
    img.src = "assets/pollicon.svg";
    img.width = "40";
    img.style.paddingBottom = "10px";
  
    div.appendChild(img);
    div.appendChild(title);
  
    let form = document.createElement("form");
    form.action = "/sessions";
    form.method = "POST";
    let inputUsername = document.createElement("input");
    inputUsername.type = "text";
    inputUsername.name = "username";
    inputUsername.id = "username";
    inputUsername.placeholder = "Username.."
    let inputPassword = document.createElement("input");
    inputPassword.type = "password";
    inputPassword.name = "password";
    inputPassword.id = "password";
    inputPassword.placeholder = "Password.."
  
    let inputSubmit = document.createElement("input");
    inputSubmit.type = "submit";
    inputSubmit.value = "Submit";
  
    form.appendChild(inputUsername);
    form.appendChild(inputPassword);
    form.appendChild(inputSubmit);
    div.appendChild(form);
  
    document.querySelector(".bar").after(div);
  
    if (document.querySelectorAll("#loginForm").length > 1) {
      document.querySelector("#loginForm").remove();
    }
  
    return inputSubmit;
  }

// handles fetch request for login action 
function logIn() {
    let submit = createLoginForm();
    submit.addEventListener("click", (e) => {
    
    e.preventDefault();
    let username = e.target.parentNode.querySelector("#username").value;
    let password = e.target.parentNode.querySelector("#password").value;
  
    let configObj = {
      method: "POST",
      headers: {
          "Content-Type": 'application/json',
          "Accept": "application/json",
      },
      body: JSON.stringify({
          username: username,
          password: password
      })
    }
    fetch(USER_URL, configObj)
    .then(resp => resp.json())
    .then(
        function(json) {
          if (json.logged_in === false) {
                let p = document.createElement("p");
                p.innerHTML = json["message"];
                p.style.color = "red";
                document.querySelector("h2").after(p);
          } else if (json.logged_in === true) {
            let dataHash = JSON.parse(json.data);
              console.log(json)
              console.log(dataHash)
                renderDashBoard(json, dataHash)
          }
          
        }
    )
    })
    
  }

  // creates container for dashboard item
  function createContainerForMenu(name, icon, color, userNum) {
    const quarterDiv = document.createElement("div");
    quarterDiv.classList = "quarter";

    const containerDiv = document.createElement("div");
    containerDiv.classList = `container ${color} padding-16`;
    containerDiv.id = name;

    const leftDiv = document.createElement("div");
    leftDiv.classList ="left";
    const i = document.createElement("i");
    i.classList = `fa fa-${icon} xxxlarge`;
    leftDiv.appendChild(i);

    const rightDiv = document.createElement("div");
    rightDiv.classList = "right";
    const number = document.createElement("h3");
    if (userNum != null) {
      number.innerText = `${userNum}`;
    }
    rightDiv.appendChild(number);


    const clearDiv = document.createElement("div");
    clearDiv.classList ="clear";

    const title = document.createElement("h4");
    title.innerHTML = name;
    
    containerDiv.appendChild(leftDiv);
    containerDiv.appendChild(rightDiv);
    containerDiv.appendChild(clearDiv);
    containerDiv.appendChild(title);
    quarterDiv.appendChild(containerDiv);

    return quarterDiv;
  }

  // renders diagram on aggregated data of user's polls
  function renderAggregatedPollDiagram (json) {
    const thirdDiv = document.createElement("div");
    thirdDiv.classList = "third";

    const header = document.createElement("h5");
    header.style.fontWeight = "bold";
    header.innerHTML = "General Stats";

    thirdDiv.appendChild(header);

    for (let i = 0; i < 3; i++) {
      let title = document.createElement("p");
      let containerDiv = document.createElement("div");
      let percentageDiv = document.createElement("div");
      containerDiv.classList ="grey";

      if (i === 0) {
        title.innerHTML = "Polls that you participated in";
        percentageDiv.classList = "container center padding blue";
        percentageDiv.style.width = `${json.polls_voted_on}%`;
        percentageDiv.innerHTML = `${json.polls_voted_on}%`
      } else if (i === 1) {
        title.innerHTML = "Winner polls";
        percentageDiv.classList = "container center padding green";
        percentageDiv.style.width = `${json.winner_polls}%`;
        percentageDiv.innerHTML = `${json.winner_polls}%`;
      } else if (i === 2) {
        title.innerHTML = "Loser polls";
        percentageDiv.classList = "container center padding red";
        percentageDiv.style.width = `${json.loser_polls}%`;
        percentageDiv.innerHTML = `${json.loser_polls}%`;
      }

      containerDiv.appendChild(percentageDiv);
      thirdDiv.appendChild(title);
      thirdDiv.appendChild(containerDiv);
    }
    document.querySelector(".row-padding").appendChild(thirdDiv)

  }

  // renders aggregated user data in list form
  function renderAggregatedUserData(json, dataHash) {
    const twoThirdDiv = document.createElement("div");
    twoThirdDiv.classList = "twothird";

    const header = document.createElement("h5");
    header.innerHTML = "Data Summary";
    header.style.fontWeight = "bold";

    const table = document.createElement("table");
    table.classList = "table striped white";

    for (let i = 0; i < 5; i++) {
      let tr = document.createElement("tr");
      let icon = document.createElement("i");
      let iconTd = document.createElement("td");
      let contentTd = document.createElement("td");

      if (i === 0 || i === 1 || i === 2) {
          icon.classList = "fa fa-share-alt text-green large";
          if (i === 0) {contentTd.innerHTML = `You have been added to ${json.added_polls} polls.`; tr.style.backgroundColor = "#F0F0F0";}
          else if (i === 1) {contentTd.innerHTML = `You have created ${json.created_polls} polls.`}
          else if (i === 2) {contentTd.innerHTML = `You have ${json.pending_polls} pending polls and ${json.closed_polls} closed polls.`; tr.style.backgroundColor = "#F0F0F0";}
      } else if (i === 3) {
          icon.classList = "fa fa-bookmark text-blue large";
          contentTd.innerHTML = `You have voted on ${dataHash.votes.length} polls.`
      } else if (i === 4) {
          icon.classList = "fa fa-users text-yellow large";
          contentTd.innerHTML = `You have ${dataHash.friends.length} friends to share polls with.`;
          tr.style.backgroundColor = "#F0F0F0";
      }

      iconTd.appendChild(icon);
      tr.appendChild(iconTd);
      tr.appendChild(contentTd);

      table.appendChild(tr);
    }
    twoThirdDiv.appendChild(header);
    header.after(document.createElement("br"))
    twoThirdDiv.appendChild(table);
    document.querySelector(".row-padding").appendChild(twoThirdDiv);

  }

    // returns the values of the selected options of a multiple selection list
    function getSelectValues(select) {
      let result = [];
      let options = select && select.options;
      let opt;
    
      for (let i=0, iLen=options.length; i<iLen; i++) {
        opt = options[i];
    
        if (opt.selected) {
          result.push(opt.value || opt.text);
        }
      }
      return result;
    }

  // grabs and sends poll data to create poll action
  function createAPoll(e) {
    const PENDING_POLLS_URL = `${BASE_URL}/users/${document.getElementById("welcome").querySelector("b").id}/polls`;

    let question = e.target.parentNode.querySelector("#question").value;
    let options = []
    Array.prototype.slice.call(e.target.parentNode.querySelectorAll('input[name="options[]"]')).forEach(n => {
      options.push(n.value)
    });
    let period = e.target.parentNode.querySelector("#period").value;
    let voteRequirement = e.target.parentNode.querySelector("#vote_requirement").value;
    let friends;
    if (document.querySelector("button[name='allFriends']").innerHTML === "All friends are added to poll!") {
      friends = "all"
    } else {
      let select = document.querySelector("select");
      friends = getSelectValues(select);
    }
    
    let username = document.querySelector("#welcome").innerText.slice(9);

    let configObj = {
      method: "POST",
      headers: {
          "Content-Type": 'application/json',
          "Accept": "application/json",
      },
      body: JSON.stringify({
          question: question,
          options: options,
          period: period,
          vote_requirement: voteRequirement,
          friends: friends,
          username: username
      })
    }
    fetch(PENDING_POLLS_URL, configObj)
    .then(resp => resp.json())
    .then(
        function(json) {
          let p = document.createElement("p");
          p.innerHTML = json.message;
          if (json.created === true) {
            p.style.color = "green";
          } else {
            p.style.color = "red";
          }
          document.getElementById("pollFormTitle").after(p);
    })
  }

  // displays create a poll form
  function pollForm(dataHash) {
    let div = document.createElement("div");
    div.id = "createAPollForm";
    div.classList = "extra";
    div.style.textAlign ="center";
    div.style.margin = "auto";
    div.style.width = "50%";
  
    let title = document.createElement("h3");
    title.innerText = "Set Your Poll's Data Here";
    title.id = "pollFormTitle"
    title.style.display = "inline-block";
    title.style.marginLeft = "5px";
  
    div.appendChild(title);
  
    let form = document.createElement("form");
    form.action = "/polls";
    form.method = "POST";
    let inputQuestion = document.createElement("input");
    inputQuestion.type = "text";
    inputQuestion.name = "question";
    inputQuestion.id = "question";
    inputQuestion.placeholder = "Question..";
    inputQuestion.style.display = "block";
    inputQuestion.style.width = "100%";

    function optionCreator() {
      let option = document.createElement("input");
      option.type = "text";
      option.name = "options[]";
      option.placeholder = "Option...";
      option.style.display = "inline-block";
      option.style.width = "100%";
      option.required = true;
      return option;
    }
    let inputOption1 = optionCreator();
    let inputOption2 = optionCreator();

    let optionButton = document.createElement("button");
    optionButton.style.width ="100%";
    optionButton.style.color ="#009688";
    optionButton.style.backgroundColor = "white";
    optionButton.innerHTML = "+ add another option";

    form.appendChild(inputQuestion);
    form.appendChild(inputOption1);
    form.appendChild(inputOption2);
    form.appendChild(optionButton);

    optionButton.addEventListener("click", (e)=> {
      e.preventDefault();
      let copyOption = optionCreator();
      form.insertBefore(copyOption, form.querySelector("button"));
    })

    let inputVoteRequirement = document.createElement("input");
    inputVoteRequirement.type = "number";
    inputVoteRequirement.name = "vote_requirement";
    inputVoteRequirement.id = "vote_requirement";
    inputVoteRequirement.classList = "padding-16";
    inputVoteRequirement.style.display ="block";
    inputVoteRequirement.style.width ="100%";
    inputVoteRequirement.style.backgroundColor ="white";
    inputVoteRequirement.placeholder = "Number of votes to close the poll..";
    form.appendChild(inputVoteRequirement);

    let inputPeriod = document.createElement("input");
    inputPeriod.type = "number";
    inputPeriod.name = "period";
    inputPeriod.id = "period";
    inputPeriod.classList = "padding-16";
    inputPeriod.style.display ="block";
    inputPeriod.style.width ="100%";
    inputPeriod.style.backgroundColor ="white";
    inputPeriod.placeholder = "Voting period in days..";
    form.appendChild(inputPeriod);

    let labelForFriendsList = document.createElement("label");
    labelForFriendsList.setAttribute("for", "allFriends");
    labelForFriendsList.innerHTML = "Add all friends or share the poll with only a few friends:"
    let addAllFriendsButton = document.createElement("button");
    addAllFriendsButton.name = "allFriends"
    addAllFriendsButton.style.width ="100%";
    addAllFriendsButton.style.color ="#009688";
    addAllFriendsButton.style.backgroundColor = "white";
    addAllFriendsButton.innerHTML = "Add all friends";
    addAllFriendsButton.addEventListener("click", (e)=> {
      e.preventDefault();
      addAllFriendsButton.innerHTML = "All friends are added to poll!"
    })
    let friendSelectList = document.createElement("select");
    friendSelectList.multiple = true;
    friendSelectList.style.width = "100%";
    friendSelectList.name = "friends[]";
    for (let i = 0; i < dataHash.friends.length; i++) {
      let option = document.createElement("option");
      option.value = dataHash.friends[i].username;
      option.innerText = dataHash.friends[i].username;
      option.style.width = "100%";
      friendSelectList.appendChild(option);
    }
    form.appendChild(labelForFriendsList);
    form.appendChild(addAllFriendsButton);
    form.appendChild(friendSelectList);

    let username = document.createElement("input");
    username.setAttribute("type", "hidden");
    username.setAttribute("name", document.querySelector("#welcome").innerText.slice(9));
    username.setAttribute("value", document.querySelector("#welcome").innerText.slice(9));
    username.id = "username";


    form.appendChild(username)
  
    let inputSubmit = document.createElement("input");
    inputSubmit.type = "submit";
    inputSubmit.value = "Submit";
    inputSubmit.style.width ="100%";
    inputSubmit.style.backgroundColor ="#009688";
    inputSubmit.addEventListener("click", (e)=> {
      e.preventDefault();
      createAPoll(e);
    })
    form.appendChild(inputSubmit);

    div.appendChild(form);

    return div;
  }

  class Poll {
    constructor(question, options, votes, period, expiration_date, vote_requirement, creator) {
      this.question = question;
      this.options = options;
      this.votes = votes;
      this.period = period;
      this.expiration_date = expiration_date;
      this.vote_requirement = vote_requirement;
      this.creator = creator;
    }
  
    calculatePercentage() {
      const total = this.votes.length;
      const result = [];

      if (total === 0) {
        for (let i = 0; i < this.options.length; i++) {
          let optionData = [];
          optionData.push(this.options[i].description);
          optionData.push(0);
          result.push(optionData);
        }
      } else {
          for (let i = 0; i < this.options.length; i++) {
            let optionData = [];
            let voteCount = 0;
            this.votes.forEach(v => {
              if (v.option_id === this.options[i].id) {
                voteCount += 1;
              }
            })
            optionData.push(this.options[i].description)
            optionData.push(Math.floor(voteCount / total * 100))
            result.push(optionData)
          }
      }
      return result;
    }
  }
  
  function createNewDiagramFromPoll(poll) {
    let div = document.createElement("div");
    div.classList = "third";
  
    let title = document.createElement("h5");
    title.innerText = "Current results";
    title.style.fontWeight = "bold";
  
    for (let opt of poll.options) {
  
      let description = document.createElement("p");
      description.innerHTML = opt.description;
  
      let pollDiv = document.createElement("div");
      pollDiv.classList = "grey";
  
      let percentageDiv = document.createElement("div");
      let randomColor = ["red", "green", "orange", "blue", "yellow", "purple"][Math.floor((Math.random() * ["red", "green", "orange", "blue", "yellow", "purple"].length))]
      percentageDiv.classList = "container center padding " + randomColor;
      let percentageValue = poll.calculatePercentage().find(option => option[0] === opt.description)[1];
      percentageDiv.style.width = `${percentageValue}%`;
      percentageDiv.innerHTML = `${percentageValue}%`;
      
      pollDiv.appendChild(percentageDiv);
      div.appendChild(description);
      div.appendChild(pollDiv)
      
    }
    div.insertBefore(title, div.querySelector("p"));
    return div;
  }

  // informs user about vote and changes percentage data on poll if necessary
  function printVoteMessage(json, question, color, percentageChange = false) {
    let parent = document.getElementById(`${question.split(" ").join("-")}`)
    const p = document.createElement("p");
    p.innerHTML = json["message"];
    p.style.color = color;
    parent.querySelector("table").after(p);

    if (percentageChange) {
      parent.querySelector(".third").querySelectorAll(".container").forEach(n => {
        for (let prop in json) {
          if (n.parentNode.previousSibling.innerText === prop) {
            n.style.width = json[prop];
            n.innerText = json[prop];
          }
        } 
      })
    } 
  }

  // adds a vote to an option
  function vote(option, question, id) {
    let configObj = {
      method: "POST",
      headers: {
          "Content-Type": 'application/json',
          "Accept": "application/json",
      },
      body: JSON.stringify({
          option: option,
          question: question,
          id: id
      })
    }
    fetch(`${USER_URL}/${id}/polls/vote`, configObj)
    .then(resp => resp.json())
    .then(
      function(json) {
        if (json.voted === true) {
          printVoteMessage(json, question, "green", true)
        } else {
          printVoteMessage(json, question, "red")
        }
      }
    )
  }

  // removes user's vote from poll's votes
  function unvote(id, question) {
    let configObj = {
      method: "POST",
      headers: {
          "Content-Type": 'application/json',
          "Accept": "application/json",
      },
      body: JSON.stringify({
          id: id,
          question: question
      })
    }
    fetch(`${USER_URL}/${id}/polls/unvote`, configObj)
    .then(resp => resp.json())
    .then(
      function(json) {
        if (json.unvoted === true) {
          printVoteMessage(json, question, "red", true)
        } else {
          printVoteMessage(json, question, "red")
        }
    })
  }
  
  // makes poll options clickable and change styles based on user interaction
  function createClickableOption(opt) {

    opt.addEventListener("click", (e) => {
      let id = document.querySelector("b").id;
      let question = e.target.parentNode.parentNode.parentNode.parentNode.querySelector("h5").innerText;

      if (e.target.style.color === "green" || e.target.style.color === "grey") {
      e.target.style.color = "black";
      e.target.parentNode.parentNode.querySelectorAll("td").forEach(td => {
        td.style.color = "black";
      })

      unvote(id, question)
      
    } else {
      e.target.style.color = "green";
      e.target.parentNode.parentNode.querySelectorAll("td").forEach(td => {
        if (td.style.color != "green") {
        td.style.color = "grey"
        }
      })
      
      vote(e.target.innerText, question, id)
    }
    })
  }

  // deletes poll if user is creator
  function deletePoll(question) {
    let id = document.querySelector("b").id;
    let configObj = {
      method: "DELETE",
      headers: {
          "Content-Type": 'application/json',
          "Accept": "application/json",
      },
      body: JSON.stringify({
          id: id,
          question: question
      })
    }
    fetch(`${USER_URL}/${id}/polls/${question}`, configObj)
    .then(resp => resp.json())
    .then(
      function(json) {
        if (json.deleted === true) {
          let poll = document.getElementById(`${question.split(" ").join("-")}`);
          poll.innerHTML ="";
          alert(`${json["message"]}`)
        } else {
          alert(`${json["message"]}`)
        }
    })
  }

  // closes poll if user is creator
  function closePoll(question) {
      let id = document.querySelector("b").id;
      let configObj = {
        method: "POST",
        headers: {
            "Content-Type": 'application/json',
            "Accept": "application/json",
        },
        body: JSON.stringify({
            id: id,
            question: question
        })
      }
      fetch(`${USER_URL}/${id}/polls/${question}/close`, configObj)
      .then(resp => resp.json())
      .then(function(json) {
        if (json.closed === true) {
          let poll = document.getElementById(`${question.split(" ").join("-")}`);
          poll.innerHTML ="";
          alert(`${json["message"]}`)
        } else {
          alert(`${json["message"]}`)
        }
        
      }

    )}

  // creates form for editing poll data
  function createEditFormForPoll(dataHash) {
    let form = pollForm(dataHash);
    form.setAttribute("action", `${BASE_URL}/users/${document.querySelector("b").id}/polls/${dataHash.question.split(" ").join("-")}`)
    form.setAttribute("method", "PATCH");
    form.querySelector("h3").innerText = "Edit Your Poll's Data Here";
    form.querySelector("form").querySelector("#question").value = dataHash.question;
    for (let i = 0; i < dataHash.options.length; i++) {
      console.log(dataHash.options[i])
      console.log(form.querySelectorAll("input[name='options[]']").length)
      if (i >= form.querySelectorAll("input[name='options[]']").length) {
        let option = document.createElement("input");
        option.type = "text";
        option.name = "options[]";
        option.value = dataHash.options[i].description;
        option.style.display = "inline-block";
        option.style.width = "100%";
        form.querySelector("input[name='options[]']").after(option);
      } else {
        let option = form.querySelector("input[placeholder='Option...']");
        option.placeholder = dataHash.options[i].description;
        option.value = dataHash.options[i].description;
      }
    }

    if (dataHash.vote_requirement) {form.querySelector("#vote_requirement").value = dataHash.vote_requirement;}
    if (dataHash.period) {form.querySelector("#period").value = dataHash.period;}

    let label = form.querySelector("label[for='allFriends']");
    label.innerText = "Remove or add new friends:"
    form.querySelector("button[name='allFriends']").innerText = "Add all missing friends";
    let addFriendsList = form.querySelector("select[name='friends[]']");
    addFriendsList.querySelectorAll("option").forEach(o=>{o.remove()})
    for (let i = 0; i < dataHash.missing_friends.length; i++) {
      let option = document.createElement("option");
      option.value = dataHash.missing_friends[i].username;
      option.innerText = dataHash.missing_friends[i].username;
      option.style.width = "100%";
      addFriendsList.appendChild(option);
    }
    
    let removeAllExistingFriendsButton = document.createElement("button");
    removeAllExistingFriendsButton.name = "removeAllExistingFriends"
    removeAllExistingFriendsButton.style.width ="100%";
    removeAllExistingFriendsButton.style.color ="#009688";
    removeAllExistingFriendsButton.style.backgroundColor = "white";
    removeAllExistingFriendsButton.innerHTML = "Remove all existing friends";
    removeAllExistingFriendsButton.addEventListener("click", (e)=> {
      e.preventDefault();
      removeAllExistingFriendsButton.innerHTML = "All previously added friends are removed!"
    })
    form.querySelector("select").after(removeAllExistingFriendsButton);
    let existingFriends = document.createElement("select");
    existingFriends.multiple = true;
    existingFriends.style.width = "100%";
    existingFriends.name = "removed_friends[]";
    for (let i = 0; i < dataHash.friends.length; i++) {
      let option = document.createElement("option");
      option.value = dataHash.friends[i].username;
      option.innerText = dataHash.friends[i].username;
      option.style.width = "100%";
      existingFriends.appendChild(option);
    }
    form.querySelector("button[name='removeAllExistingFriends']").after(existingFriends);

    let hidden = form.querySelector("input[type='hidden']");
    hidden.name = dataHash.poll_id;
    hidden.value = dataHash.poll_id;
    hidden.id = "pollId"

    let formerSubmit = form.querySelector("input[type='submit']");
    formerSubmit.remove();
    let inputSubmit = document.createElement("input");
    inputSubmit.type = "submit";
    inputSubmit.value = "Submit";
    inputSubmit.style.width ="100%";
    inputSubmit.style.backgroundColor ="#009688";
    inputSubmit.addEventListener("click", (e)=> {
      e.preventDefault();
      updatePoll(e, dataHash.question);
    })
    form.appendChild(inputSubmit);
    

    return form;
  }

  // renders edit poll form is user is creator
  function editPoll(question) {
    let id = document.querySelector("b").id;
      let configObj = {
        method: "POST",
        headers: {
            "Content-Type": 'application/json',
            "Accept": "application/json",
        },
        body: JSON.stringify({
            id: id,
            question: question
        })
      }
      fetch(`${USER_URL}/${id}/polls/${question}/edit`, configObj)
      .then(resp => resp.json())
      .then(function(json) {
        document.querySelector(".extra").remove();
        let div = createEditFormForPoll(json);
        document.querySelector(".main").insertBefore(div, document.querySelector(".panel"));
      })
  }

  // sends poll data to udpate existing poll
  function updatePoll(e, originalQuestion) {
    const PENDING_POLLS_URL = `${BASE_URL}/users/${document.querySelector("b").id}/polls/${originalQuestion.split(" ").join("-")}`;

    let newQuestion = e.target.parentNode.querySelector("#question").value;
    let options = []
    Array.prototype.slice.call(e.target.parentNode.querySelectorAll('input[name="options[]"]')).forEach(n => {
      options.push(n.value)
    });
    let period = e.target.parentNode.querySelector("#period").value;
    let voteRequirement = e.target.parentNode.querySelector("#vote_requirement").value;
    let select = document.querySelector("select[name='friends[]']");
    let friends = [];
    if (document.querySelector("button[name='allFriends']").innerHTML === "All friends are added to poll!") {
      document.querySelector("select[name='friends[]']").querySelectorAll("option").forEach(o => {
        friends.push(o.value);
      })
    } else {
      friends = getSelectValues(select);
    }
    
    let pollId = document.getElementById('pollId').value;

    let removedFriends;
    if (document.querySelector("button[name='removeAllExistingFriends']").innerHTML === "All previously added friends are removed!") {
      removedFriends = "all"
    } else {
      let removedSelect = document.querySelector("select[name='removed_friends[]']");
      removedFriends = getSelectValues(removedSelect);
    }
    
    let id = document.querySelector("b").id;

    let configObj = {
      method: "PATCH",
      headers: {
          "Content-Type": 'application/json',
          "Accept": "application/json",
      },
      body: JSON.stringify({
          new_question: newQuestion,
          options: options,
          period: period,
          vote_requirement: voteRequirement,
          friends: friends,
          removed_friends: removedFriends,
          id: id,
          poll_id: pollId
      })
    }
    fetch(PENDING_POLLS_URL, configObj)
    .then(resp => resp.json())
    .then(
        function(json) {
          let p = document.createElement("p");
          p.innerHTML = json.message;
          if (json.updated === true) {
            p.style.color = "green";
          } else {
            p.style.color = "red";
          }
          document.getElementById("pollFormTitle").after(p);
    })
  }

  // renders links to functions for deleting, closing, and editing poll if user is creator
  function displayCreatorLinks(question) {
    let tr = document.createElement("tr");
    let td = document.createElement("td");
    for (let i = 0; i < 3; i++) {
      let link = document.createElement("a");
      if (i === 0) {
        link.innerHTML = "Edit poll  ";
        link.addEventListener("click", ()=> {
          editPoll(question)
        })
      } else if (i === 1) {
        link.innerHTML = "Close poll  ";
        link.addEventListener("click", ()=> {
          alert("Are your sure?");
          closePoll(question)
        })
      } else if (i === 2) {
        link.innerHTML = "Delete poll  ";
        link.addEventListener("click", ()=> {
          alert("Are your sure?");
          deletePoll(question)
        })
      }
      link.style.color = "blue";
      td.appendChild(link);
    }
    tr.appendChild(td);
    return tr;
  }
  
  // creates a voting form for a particular pending poll
  function createNewVotingFormFromPoll(poll) {
    let div = document.createElement("div");
    div.classList ="twothird extra";
    let table = document.createElement("table");
    table.classList = "table striped white";
    let tbody = document.createElement("tbody");
    table.appendChild(tbody);
    div.appendChild(table);
  
    let question = document.createElement("h5");
    question.innerHTML = poll.question;
    question.style.fontWeight = 'bold';
    div.insertBefore(question, div.querySelector("table"));
    question.after(document.createElement("br"))
  
    for (let i = 0; i < poll.options.length; i++) {
      let tr = document.createElement("tr");
      let td = document.createElement("td");
      td.innerHTML = poll.options[i].description;
      createClickableOption(td);
      tr.appendChild(td);
      tbody.appendChild(tr);
    }
    if (poll.vote_requirement != null) {
      let tr = document.createElement("tr");
      let td = document.createElement("td");
      td.innerHTML = "Voting requirement:" + poll.vote_requirement;
      td.style.fontStyle = "italic";
      tr.appendChild(td);
      tbody.appendChild(tr);
    }
  
    if (poll.expiration_date != null) {
      let tr = document.createElement("tr");
      let td = document.createElement("td");
      td.innerHTML = "Closing date for poll: " + poll.expiration_date;
      td.style.fontStyle = "italic";
      tr.appendChild(td)
      tbody.appendChild(tr)
    }
    if (poll.creator === document.querySelector("#welcome").innerText.slice(9)) {
      let creatorTr = displayCreatorLinks(poll.question);
      tbody.appendChild(creatorTr);
    }
    return div;
  }

  // displays diagram and voting form for all pending polls of user
  function listPendingForms() {
    let id = document.getElementById("welcome").querySelector("b").id;
    const PENDING_POLLS_URL = `${BASE_URL}/users/${id}/polls`;
    let container = document.createElement("div");
    container.classList = "panel extra";

      fetch(PENDING_POLLS_URL)
      .then(resp => resp.json())
      .then(function (json) {
        
        for (let i = 0; i < json.length; i++) {
          let parent = document.createElement("div");
          parent.classList = "row-padding extra";
          parent.id = `${json[i].question.split(" ").join("-")}`
          parent.style.margin = "0 -16px";
          let poll = new Poll(json[i].question, json[i].options, json[i].votes, json[i].period, json[i].expiration_date, json[i].vote_requirement, json[i].creator);
          
          let diagramDiv = createNewDiagramFromPoll(poll);
          parent.appendChild(diagramDiv);
          let votingFormDiv = createNewVotingFormFromPoll(poll);
          parent.appendChild(votingFormDiv);
          parent.style.marginBottom = "50px";
          container.appendChild(parent);
        }
      })
    
    return container;
  }

  // creates voting form for closed polls without functionality for voting or editing
  function createNewVotingFormFromClosedPoll(poll) {
    let div = document.createElement("div");
    div.classList ="twothird extra";
    let table = document.createElement("table");
    table.classList = "table striped white";
    let tbody = document.createElement("tbody");
    table.appendChild(tbody);
    div.appendChild(table);
  
    let question = document.createElement("h5");
    question.innerHTML = poll.question;
    question.style.fontWeight = 'bold';
    div.insertBefore(question, div.querySelector("table"));
    question.after(document.createElement("br"))
  
    for (let i = 0; i < poll.options.length; i++) {
      let tr = document.createElement("tr");
      let td = document.createElement("td");
      td.innerHTML = poll.options[i].description;
      td.style.color = "grey";
      tr.appendChild(td);
      tbody.appendChild(tr);
    }
  
    return div;
  }

  // displays diagrams and forms for closed polls
  function listClosedPolls() {
    let id = document.getElementById("welcome").querySelector("b").id;
    const PENDING_POLLS_URL = `${BASE_URL}/users/${id}/polls/closed`;
    let container = document.createElement("div");
    container.classList = "panel extra";

      fetch(PENDING_POLLS_URL)
      .then(resp => resp.json())
      .then(function (json) {
        
        for (let i = 0; i < json.length; i++) {
          let parent = document.createElement("div");
          parent.classList = "row-padding extra";
          parent.id = `${json[i].question.split(" ").join("-")}`
          parent.style.margin = "0 -16px";
          let poll = new Poll(json[i].question, json[i].options, json[i].votes, json[i].period, json[i].expiration_date, json[i].vote_requirement, json[i].creator);
          
          let diagramDiv = createNewDiagramFromPoll(poll);
          diagramDiv.querySelector("h5").innerText = "Final results";
          parent.appendChild(diagramDiv);
          let votingFormDiv = createNewVotingFormFromClosedPoll(poll);
          parent.appendChild(votingFormDiv);
          parent.style.marginBottom = "50px";
          container.appendChild(parent);
        }
      })
    
    return container;
  }

  // creates search bar for finding and adding new friends
  function addFriendsTable(json) {
    const div = document.createElement("div");
    div.classList = "container";
    div.id = "friendSearchBar"

    const header = document.createElement("h5");
    header.innerHTML = "Add new friends:";
    header.style.fontWeight = "bold";
    header.style.marginTop = "50px";

    const table = document.createElement("table");
    table.classList = "table striped white bordered border";

    const tr = document.createElement("tr"); 
    let inputTd = document.createElement("td");
    let buttonTd = document.createElement("td");

    let label = document.createElement("label");
    label.setAttribute("for", "friendname");
    label.innerText = "Friend's username:";
    label.style.padding = "5px";

    let input = document.createElement("input");
    input.setAttribute("name", "friendname");
    input.type = "text";
    
    inputTd.appendChild(label);
    inputTd.appendChild(input);

    let searchButton = document.createElement("button");
    searchButton.setAttribute("value", "Search");
    searchButton.innerText = "Search";
    searchButton.addEventListener("click", (e)=> {
      e.preventDefault();
      friendSearch(json)
    })

    buttonTd.appendChild(searchButton);

    tr.appendChild(inputTd);
    tr.appendChild(buttonTd);
    table.appendChild(tr);

    div.appendChild(header);
    div.appendChild(table);
    
    return div
  }

  function friendSearch() {
    let friend = document.querySelector("#friendSearchBar").querySelector("input[name='friendname']").value
    let configObj = {
      method: "POST",
      headers: {
          "Content-Type": 'application/json',
          "Accept": "application/json",
      },
      body: JSON.stringify({
          friend: friend
      })
    }
    fetch(USER_URL, configObj)
    .then(resp => resp.json())
    .then(
        function(json) {
          
        })
  }

  function renderFriends() {
    const FRIENDS_URL = `${USER_URL}/${document.querySelector("b").id}/friends`;
    let container = document.createElement("div");
    container.classList = "panel extra";

    fetch(FRIENDS_URL)
      .then(resp => resp.json())
      .then(function (json) {
        console.log(json)
        let friendTable = addFriendsTable(json);
        container.appendChild(friendTable)
    })

    return container;
  }

  // renders dashboard after successful login
  function renderDashBoard(json, dataHash) {
    if (document.querySelector("#loginForm")) {
      document.querySelector("#loginForm").remove();
    } 
    
    const mainDiv = document.querySelector(".main");
    mainDiv.style.display = "block";

    // creates welcoming header
    if (!document.querySelector("#welcome")) {
      const h4 = document.createElement("h4");
      const b = document.createElement("b");
      b.id = dataHash.id;
      b.innerHTML = `Welcome, ${dataHash.username}`
      h4.id = "welcome"
      h4.appendChild(b);

      // inserting welcome header containing user's name
      mainDiv.insertBefore(h4, mainDiv.querySelector(".panel"));
    }
    

    // array contaiing the individual attirubtes of all dashboard item container
    const containers = [
        {
            name: "Create a Poll",
            icon: "share-alt",
            color: "teal",
            userNum: null,
            listener: pollForm
        },

        {
            name: "Pending Polls",
            icon: "comment",
            color: "red",
            userNum: dataHash.polls.filter(p => p.status === "pending").length,
            listener: listPendingForms
        },

        {
            name: "Closed Polls",
            icon: "eye",
            color: "blue",
            userNum: dataHash.polls.filter(p => p.status === "closed").length,
            listener: listClosedPolls
        },

        {
            name: "Friends",
            icon: "users",
            color: "orange",
            userNum: dataHash.friends.length,
            listener: renderFriends
        }

    ]

    // renders diagram of aggregated user data
    renderAggregatedPollDiagram(json);

    // renders list of additional aggregated user data
    renderAggregatedUserData(json, dataHash);

    // displaying the 4 container for menu items
    if (!document.querySelector(".quarter")) {
    for (let i = 0; i < containers.length; i++) {
      const container = createContainerForMenu(containers[i]["name"], containers[i]["icon"], containers[i]["color"], containers[i]["userNum"])
      mainDiv.insertBefore(container, mainDiv.querySelector(".panel"));
      container.addEventListener("click", ()=> {
        if (document.querySelector(".row-padding.normal").innerHTML != "") {

          document.getElementById(containers[i]["name"]).querySelector("h4").innerHTML = "Back to Dashboard";
          let el = containers[i].listener(dataHash);
          document.querySelector(".row-padding.normal").innerHTML = "";          
          mainDiv.insertBefore(el, document.querySelector(".panel"));
        } else {
          document.querySelector(".extra").remove();
          document.getElementById(containers[i]["name"]).querySelector("h4").innerHTML = containers[i]["name"];
          renderDashBoard(json, dataHash);
        }
      })
  }
  }
}