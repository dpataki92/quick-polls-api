

//creates div with 4 links to change chart type
function createDivWithLinksForChartTypes () {
const div = document.createElement("div");
div.id = "chart-links";

for (let i = 0; i < 4 ; i++) {
    let a = document.createElement("a");
    a.classList="chart-link"
    if (i === 0) {a.innerHTML = "Bar"; a.id="bar";}
    else if (i === 1) {a.innerHTML = "Horizontal bar"; a.id="horizontalBar";}
    else if (i === 2) {a.innerHTML = "Pie"; a.id="pie";}
    else if (i === 3) {a.innerHTML = "Doughnut"; a.id="doughnut";}
    div.appendChild(a);
}

return div;
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
    
    let username = document.querySelector("#welcome").innerText.slice(9, 17);

    let configObj = {
      method: "POST",
      headers: {
          "Content-Type": 'application/json',
          "Accept": "application/json",
          "Authorization": `Bearer ${localStorage.getItem('jwt_token')}`
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
  
    let title = document.createElement("h3");
    title.innerText = "Create a Poll";
    title.id = "pollFormTitle";
  
    div.appendChild(title);
  
    let form = document.createElement("form");
    form.action = "/polls";
    form.method = "POST";
    let inputQuestion = document.createElement("input");
    inputQuestion.type = "text";
    inputQuestion.name = "question";
    inputQuestion.id = "question";
    inputQuestion.classList = "txt";
    inputQuestion.placeholder = "Question..";

    function optionCreator() {
      let option = document.createElement("input");
      option.type = "text";
      option.name = "options[]";
      option.placeholder = "Option...";
      option.required = true;
      option.classList = "txt";
      return option;
    }
    let inputOption1 = optionCreator();
    let inputOption2 = optionCreator();

    let optionButton = document.createElement("button");
    optionButton.id = "optionButton";
    optionButton.innerHTML = "+ Add option";

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
    inputVoteRequirement.setAttribute("min", 0);
    inputVoteRequirement.name = "vote_requirement";
    inputVoteRequirement.id = "vote_requirement";
    inputVoteRequirement.classList = "txt";
    inputVoteRequirement.placeholder = "Number of votes to close the poll..";
    form.appendChild(inputVoteRequirement);

    let inputPeriod = document.createElement("input");
    inputPeriod.type = "number";
    inputPeriod.setAttribute("min", 0);
    inputPeriod.name = "period";
    inputPeriod.id = "period";
    inputPeriod.classList = "txt";
    inputPeriod.placeholder = "Voting period in days..";
    form.appendChild(inputPeriod);

    let labelForFriendsList = document.createElement("label");
    labelForFriendsList.setAttribute("for", "allFriends");
    labelForFriendsList.innerHTML = "Add your friends to the poll:"
    let addAllFriendsButton = document.createElement("button");
    addAllFriendsButton.name = "allFriends";
    addAllFriendsButton.id = "allFriends";
    addAllFriendsButton.style.color ="#009688";
    addAllFriendsButton.innerHTML = "+ Add all friends";
    addAllFriendsButton.addEventListener("click", (e)=> {
      e.preventDefault();
      addAllFriendsButton.innerHTML = "Added all friends!"
    })
    let friendSelectList = document.createElement("select");
    friendSelectList.multiple = true;
    friendSelectList.classList = "txt";
    friendSelectList.name = "friends[]";
    for (let i = 0; i < dataHash.friends.length; i++) {
      let option = document.createElement("option");
      option.value = dataHash.friends[i].username;
      option.innerText = dataHash.friends[i].username;
      option.classList = "text";
      friendSelectList.appendChild(option);
    }
    form.appendChild(labelForFriendsList);
    form.appendChild(addAllFriendsButton);
    form.appendChild(friendSelectList);

    let username = document.createElement("input");
    username.setAttribute("type", "hidden");
    username.setAttribute("name", document.querySelector("#welcome").innerText.slice(9,17));
    username.setAttribute("value", document.querySelector("#welcome").innerText.slice(9,17));
    username.id = "username";

    form.appendChild(username)
  
    let inputSubmit = document.createElement("input");
    inputSubmit.type = "submit";
    inputSubmit.value = "Submit";
    inputSubmit.id = "createPollSubmit";
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

  // class for creating poll instances to be used in poll listing functions
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
            optionData.push(parseFloat((voteCount / total * 100).toFixed(1)))
            result.push(optionData)
          }
      }
      return result;
    }
  }

  // creates diagram with the current results for individual poll
  function createNewDiagramFromPoll(poll) {
    let div = document.createElement("div");
    div.classList = "third";

    const canvas = document.createElement("canvas");
    canvas.id = `myChart-${poll.question}`;
    div.appendChild(canvas);
    
    let myChart = canvas.getContext("2d");
    let optionLabels = [];
    poll.options.forEach(e => optionLabels.push(e.description));
    let chartData = [];
    poll.calculatePercentage().forEach(e => chartData.push(e[1]));
    let backgroundColors = ["#2196F3", "#4CAF50", "#f44336", "#17a2b8", "#ffc107",  "#6c757d", "#343a40", "#f8f9fa"]
    let chartColors = [];
    for (let i = 0; i < optionLabels.length; i++) {
      if (i < backgroundColors.length) {
        chartColors.push(backgroundColors[i])
      } else {
        chartColors.push(backgroundColors[Math.floor(Math.random()*backgroundColors.length)])
      }
      
    }

    let massPopChart = new Chart(myChart, {
      type: "bar",
      data: {
        labels: optionLabels,
        datasets: [{
          data: chartData,
          backgroundColor: chartColors
        }]
      },
      options: {
        title: {
          display: true,
          text: "Current results (%)"
        },
        legend: {
          display: false
        }
      }
    })

    let linksDiv = createDivWithLinksForChartTypes();
    linksDiv.querySelectorAll(".chart-link").forEach(a => {
      a.addEventListener("click", (e) => {
        massPopChart.destroy();
        massPopChart = new Chart(myChart, {
          type: a.id,
          data: {
            labels: optionLabels,
            datasets: [{
              data: chartData,
              backgroundColor: chartColors
            }]
          },
          options: {
            title: {
              display: true,
              text: "Current results (%)"
            },
            legend: {
              display: false
            }
          }
        })    
      })
    })
    div.appendChild(linksDiv);

    return div;
  }

  // informs user about vote and changes percentage data on poll if necessary
  function printVoteMessage(json, question, color, percentageChange = false) {
    let parent = document.getElementById(`${question.split(" ").join("-")}`)
    const p = document.createElement("p");
    p.innerHTML = json["message"];
    p.style.color = color;

    const removeP = () => {p.remove()};
    parent.querySelector("table").after(p);
    setTimeout(removeP, 3000);

    if (percentageChange) {
      const canvas = parent.querySelector('canvas')
      canvas.remove();

      const newCanvas = document.createElement("canvas");
      newCanvas.id = `myChart-${question}`;
      parent.querySelector(".third").insertBefore(newCanvas, parent.querySelector("#chart-links"));
      let myChart = newCanvas.getContext("2d");
      
      let backgroundColors = ["#2196F3", "#4CAF50", "#f44336", "#17a2b8", "#ffc107",  "#6c757d", "#343a40", "#f8f9fa"]
      let chartColors = [];
      for (let i = 0; i < json.options.length; i++) {
        if (i < backgroundColors.length) {
          chartColors.push(backgroundColors[i])
        } else {
          chartColors.push(backgroundColors[Math.floor(Math.random()*backgroundColors.length)])
        }
      }

      let updatedMassPopChart = new Chart(myChart, {
        type: "bar",
        data: {
          labels: json.options,
          datasets: [{
            data: json.new_percentage,
            backgroundColor: chartColors
          }]
        },
        options: {
          title: {
            display: true,
            text: "Current results (%)"
          },
          legend: {
            display: false
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
          "Authorization": `Bearer ${localStorage.getItem('jwt_token')}`
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
          "Authorization": `Bearer ${localStorage.getItem('jwt_token')}`
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
    let slug = question.split(" ").join("-").replace("?", "");
    let id = document.querySelector("b").id;
    let configObj = {
      method: "DELETE",
      headers: {
          "Content-Type": 'application/json',
          "Accept": "application/json",
          "Authorization": `Bearer ${localStorage.getItem('jwt_token')}`
      },
      body: JSON.stringify({
          id: id,
          originalQuestion: question
      })
    }
    fetch(`${USER_URL}/${id}/polls/${slug}`, configObj)
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
      let slug = question.split(" ").join("-").replace("?", "");
      let id = document.querySelector("b").id;
      let configObj = {
        method: "POST",
        headers: {
            "Content-Type": 'application/json',
            "Accept": "application/json",
            "Authorization": `Bearer ${localStorage.getItem('jwt_token')}`
        },
        body: JSON.stringify({
            id: id,
            originalQuestion: question
        })
      }
      fetch(`${USER_URL}/${id}/polls/${slug}/close`, configObj)
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
    let slug = dataHash.question.split(" ").join("-").replace("?", "");
    let form = pollForm(dataHash);
    form.setAttribute("action", `${BASE_URL}/users/${document.querySelector("b").id}/polls/${slug}`)
    form.setAttribute("method", "PATCH");
    form.querySelector("h3").innerText = "Edit Poll";
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
    form.querySelector("button[name='allFriends']").innerText = "+ Add all missing friends";
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
    removeAllExistingFriendsButton.name = "removeAllExistingFriends";
    removeAllExistingFriendsButton.id = "removeAllExistingFriends";
    removeAllExistingFriendsButton.innerHTML = "- Remove all existing friends";
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
    inputSubmit.id = "editPollSubmit";
    inputSubmit.addEventListener("click", (e)=> {
      e.preventDefault();
      updatePoll(e, dataHash.question);
    })
    form.appendChild(inputSubmit);
    

    return form;
  }

  // renders edit poll form is user is creator
  function editPoll(question) {
    let slug = question.split(" ").join("-").replace("?", "");
    let id = document.querySelector("b").id;

    let configObj = {
      method: "POST",
      headers: {
          "Content-Type": 'application/json',
          "Accept": "application/json",
          "Authorization": `Bearer ${localStorage.getItem('jwt_token')}`
      },
      body: JSON.stringify({
        originalQuestion: question
    })
    }
    fetch(`${USER_URL}/${id}/polls/${slug}/edit`, configObj)
    .then(resp => resp.json())
    .then(function(json) {
      console.log(json)
      document.querySelector(".extra").remove();
      let div = createEditFormForPoll(json);
      document.querySelector(".main").insertBefore(div, document.querySelector(".panel"));
    })
  }

  // sends poll data to udpate existing poll
  function updatePoll(e, question) {
    let slug = question.split(" ").join("-").replace("?", "");
    const PENDING_POLLS_URL = `${BASE_URL}/users/${document.querySelector("b").id}/polls/${slug}`;

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
          "Authorization": `Bearer ${localStorage.getItem('jwt_token')}`
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
      link.classList = "creator-links";
      if (i === 0) {
        link.innerHTML = "Edit poll  ";
        link.addEventListener("click", ()=> {
          editPoll(question)
        })
      } else if (i === 1) {
        link.innerHTML = "Close poll  ";
        link.addEventListener("click", ()=> {
          window.confirm("Are you sure?");
          closePoll(question)
        })
      } else if (i === 2) {
        link.innerHTML = "Delete poll  ";
        link.addEventListener("click", ()=> {
          window.confirm("Are you sure?");
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
      td.classList = "option";
      if (poll.votes.find(v => v.user_id === parseInt(document.querySelector("b").id))) {td.style.color = "grey"}
      createClickableOption(td);
      tr.appendChild(td);
      tbody.appendChild(tr);
    }
    if (poll.vote_requirement != null) {
      let tr = document.createElement("tr");
      let td = document.createElement("td");
      td.style.color = "red";
      td.style.opacity = 0.5;
      td.innerHTML = "Vote requirement: " + poll.vote_requirement + " votes";
      tr.appendChild(td);
      tbody.appendChild(tr);
    }
  
    if (poll.expiration_date != null) {
      let tr = document.createElement("tr");
      let td = document.createElement("td");
      td.innerHTML = "Closing date: " + poll.expiration_date;
      td.style.color = "red";
      td.style.opacity = 0.5;
      tr.appendChild(td)
      tbody.appendChild(tr)
    }
    if (poll.creator === document.querySelector("#welcome").innerText.slice(9,17)) {
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

    fetch(PENDING_POLLS_URL,{ 
      method: "GET",
      headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${localStorage.getItem('jwt_token')}`
      }
    })
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
    const CLOSED_POLLS_URL = `${BASE_URL}/users/${id}/polls/closed`;
    let container = document.createElement("div");
    container.classList = "panel extra";

    fetch(CLOSED_POLLS_URL, { 
      method: "GET",
      headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${localStorage.getItem('jwt_token')}`
      }
    })
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
          let votingFormDiv = createNewVotingFormFromClosedPoll(poll);
          parent.appendChild(votingFormDiv);
          parent.style.marginBottom = "50px";
          container.appendChild(parent);
        }
      })
    
    return container;
  }
