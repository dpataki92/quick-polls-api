const BASE_URL = "http://localhost:3000"
const PENDING_POLLS_URL = `${BASE_URL}/polls`
const CLOSED_POLLS_URL = `${BASE_URL}/polls/closed`
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
          if (i === 0) {contentTd.innerHTML = `You have been added to ${json.added_polls} polls.`}
          else if (i === 1) {contentTd.innerHTML = `You have created ${json.created_polls} polls.`}
          else if (i === 2) {contentTd.innerHTML = `You have ${json.pending_polls} pending polls and ${json.closed_polls} closed polls.`}
      } else if (i === 3) {
          icon.classList = "fa fa-bookmark text-blue large";
          contentTd.innerHTML = `You have voted on ${dataHash.votes.length} polls.`
      } else if (i === 4) {
          icon.classList = "fa fa-users text-yellow large";
          contentTd.innerHTML = `You have ${dataHash.friends.length} friends to share polls with.`
      }

      iconTd.appendChild(icon);
      tr.appendChild(iconTd);
      tr.appendChild(contentTd);

      table.appendChild(tr);
    }
    twoThirdDiv.appendChild(header);
    twoThirdDiv.appendChild(table);
    document.querySelector(".row-padding").appendChild(twoThirdDiv);

  }

  // renders dashboard after successful login
  function renderDashBoard(json, dataHash) {
    
    document.querySelector("#loginForm").remove();
    const mainDiv = document.querySelector(".main");
    mainDiv.style.display = "block";

    // creates welcoming header
    const h4 = document.createElement("h4");
    const b = document.createElement("b");
    b.innerHTML = `Welcome, ${dataHash.username}`
    h4.id = "welcome"
    h4.appendChild(b);

    // array contaiing the individual attirubtes of all dashboard item container
    const containers = [
        {
            name: "Create a Poll",
            icon: "share-alt",
            color: "teal",
            userNum: null
        },

        {
            name: "Pending Polls",
            icon: "comment",
            color: "red",
            userNum: dataHash.polls.filter(p => p.status === "pending").length
        },

        {
            name: "Closed Polls",
            icon: "eye",
            color: "blue",
            userNum: dataHash.polls.filter(p => p.status === "closed").length
        },

        {
            name: "Friends",
            icon: "users",
            color: "orange",
            userNum: dataHash.friends.length
        }

    ]

    // inserting welcome header containing user's name
    mainDiv.insertBefore(h4, mainDiv.querySelector(".panel"));

    // displaying the 4 container for menu items
    for (let i = 0; i < containers.length; i++) {
        const container = createContainerForMenu(containers[i]["name"], containers[i]["icon"], containers[i]["color"], containers[i]["userNum"])
        mainDiv.insertBefore(container, mainDiv.querySelector(".panel"));
    }

    // renders diagram of aggregated user data
    renderAggregatedPollDiagram(json);

    // renders list of additional aggregated user data
    renderAggregatedUserData(json, dataHash);
  }