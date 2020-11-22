// creates login form
function createLoginForm() {
    document.querySelector(".main").style.display = "none";
    document.querySelector(".bar").style.display = "none";
    let div = document.createElement("div");
    div.id = "loginForm";
  
    let title = document.createElement("h2");
    title.innerText = "Quick polls";
    title.id = "loginTitle"
    
    let img = document.createElement("img");
    img.src = "assets/pollicon.svg";
    img.id = "loginImg";
  
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
              setTimeout(function() {document.querySelector("p").remove()}, 3500);
          } else if (json.logged_in === true) {
              localStorage.setItem('jwt_token', json.token);
              let dataHash = JSON.parse(json.data);
              document.querySelector(".bar").style.display = "block";
              document.querySelector(".fa-sign-out-alt").addEventListener("click", logout);
              renderDashBoard(json, dataHash);
          }
        })
    })
  }
  
    // logs out user
    function logout() {
        window.confirm("Are you sure?");
        localStorage.clear();
        location.reload();
      }