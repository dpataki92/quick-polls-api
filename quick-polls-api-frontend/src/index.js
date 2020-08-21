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
                let p = document.createElement("p");
                p.innerHTML = json.username;
                p.style.color = "green";
                document.querySelector("h2").after(p);
                console.log(json)
          }
          
        }
    )
    })
    
  }

  // creates container for menu point
  function createContainerForMenu(name, icon, color, userNum = null) {
    const quarterDiv = document.createElement("div");
    quarterDiv.classList = "quarter";

    const containerDiv = document.createElement("div");
    containerDiv.classList = `container ${color} padding-16`;
    containerDiv.id = name;

    const leftDiv = document.createElement("div");
    const i = document.createElement("i");
    i.classList = `fa fa-${icon} xxxlarge`;
    leftDiv.appendChild(i);

    const rightDiv = document.createElement("div");
    rightDiv.classList = "right";
    
    if (userNum != null) {
        const number = document.createElement("h3");
        h3.innerHTML = `${userNum}`;
        rightDiv.appendChild(number);
    }

    const title = document.createElement("h4");
    title.innerHTML = name;
    
    containerDiv.appendChild(leftDiv);
    containerDiv.appendChild(rightDiv);
    containerDiv.appendChild(title);
    quarterDiv.appendChild(containerDiv);


  }



  // renders dashboard after successful login
  function renderDashBoard(json) {
    const mainDiv = document.querySelector(".main");

    // creates welcoming header
    const h4 = document.createElement("h4");
    const b = document.createElement("b");
    b.innerHTML = `Welcome, ${json.username}`

  }