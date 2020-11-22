// creates search bar for finding and adding new friends
function addFriendsTable(json) {
    const div = document.createElement("div");
    div.classList = "container";
    div.id = "friendSearchBar";

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
      friendSearch(json);
    })

    buttonTd.appendChild(searchButton);

    tr.appendChild(inputTd);
    tr.appendChild(buttonTd);
    table.appendChild(tr);

    div.appendChild(header);
    div.appendChild(table);
    
    return div;
  }

  // adds a friend to user's friend list
  function addToFriends() {
    let friend = document.querySelector("#friendSearchBar").querySelector("input[name='friendname']").value;
    let id = document.querySelector("b").id;

    let configObj = {
      method: "POST",
      headers: {
          "Content-Type": 'application/json',
          "Accept": "application/json",
          "Authorization": `Bearer ${localStorage.getItem('jwt_token')}`
      },
      body: JSON.stringify({
          friend: friend,
          id: id
      })
    }
    fetch(`${USER_URL}/${id}/friends`, configObj)
    .then(resp => resp.json())
    .then(
        function(json) {
            
          let responseRow = document.querySelector("#searchFriendResponse");
          responseRow.firstChild.innerHTML = json["message"];
          responseRow.lastChild.innerHTML = "";
          responseRow.style.color = "green";

          let table = document.querySelector(".current-friends");
          const tr = document.createElement("tr");
          let iconTd = document.createElement("i");
          iconTd.classList = "fa fa-male text-yellow large";
        
          let friendTd = document.createElement("td");
          friendTd.innerText = json["friend"];
          friendTd.classList = "username";
    
          let buttonTd = document.createElement("td");
          let removeButton = document.createElement("button");
          removeButton.setAttribute("value", "Remove Friend");
          removeButton.innerText = "Remove Friend";
          removeButton.addEventListener("click", (e)=> {
            e.preventDefault();
            removeFriend(json.friends[i].username, e);
          })
          buttonTd.appendChild(removeButton);
          tr.appendChild(iconTd);
          tr.appendChild(friendTd);
          tr.appendChild(buttonTd);
          if (table.lastChild.innerText.includes("removed")) {table.lastChild.remove()};
          table.appendChild(tr);
    })
  }

  // looks for a particular user in the user database by username and returns if there is a match
  function friendSearch() {
    let friend = document.querySelector("#friendSearchBar").querySelector("input[name='friendname']").value;
    let id = document.querySelector("b").id;

    let configObj = {
      method: "POST",
      headers: {
          "Content-Type": 'application/json',
          "Accept": "application/json",
          "Authorization": `Bearer ${localStorage.getItem('jwt_token')}`
      },
      body: JSON.stringify({
          friend: friend,
          id: id
      })
    }
    fetch( `${USER_URL}/${id}/friends/search`, configObj)
    .then(resp => resp.json())
    .then(
        function(json) {

          let table = document.querySelector("#friendSearchBar").querySelector("table");

          if (table.querySelectorAll("tr").length > 1) {
            table.lastChild.remove();
          }

          const tr = document.createElement("tr");
          tr.id = "searchFriendResponse";
          const messageTd = document.createElement("td");
          messageTd.innerText = json["message"];
          messageTd.style.color = "red";
          tr.appendChild(messageTd);
          const buttonTd = document.createElement("td");

          if (json["found"] === true) {
            
            let addButton = document.createElement("button");
            addButton.setAttribute("value", "Add to friends");
            addButton.innerText = "Add to friends";
            addButton.addEventListener("click", (e)=> {
              e.preventDefault();
              addToFriends(friend);
            })
            buttonTd.appendChild(addButton);
            messageTd.style.color = "green";
          }

          tr.appendChild(buttonTd);
          table.appendChild(tr)
        })
  }

  // removes friends from user's friends
  function removeFriend(friend, e) {
    let id = document.querySelector("b").id;

    let configObj = {
      method: "DELETE",
      headers: {
          "Content-Type": 'application/json',
          "Accept": "application/json",
          "Authorization": `Bearer ${localStorage.getItem('jwt_token')}`
      },
      body: JSON.stringify({
          friend: friend,
          id: id
      })
    }
    fetch( `${USER_URL}/${id}/friends`, configObj)
    .then(resp => resp.json())
    .then(
        function(json) {

          let tr = e.target.parentNode.parentNode;
          tr.lastChild.innerHTML = "";
          tr.firstChild.nextSibling.innerHTML = json["message"];
          tr.firstChild.nextSibling.style.color = "red";
    })
  }

  // renders current friends list with buttons to remove 
  function currentFriends(json) {
    const div = document.createElement("div");
    div.classList = "container";
    div.id = "friendList"

    const header = document.createElement("h5");
    header.innerHTML = "Current friends:";
    header.style.fontWeight = "bold";
    header.style.marginTop = "50px";

    const table = document.createElement("table");
    table.classList = "table striped white bordered border current-friends";

    for (let i = 0; i < json.friends.length; i++) {
      const tr = document.createElement("tr");

      let iconTd = document.createElement("i");
      iconTd.classList = "fa fa-male text-yellow large";
    
      let friendTd = document.createElement("td");
      friendTd.innerText = json.friends[i].username;
      friendTd.classList = "username";

      let buttonTd = document.createElement("td");
      let removeButton = document.createElement("button");
      removeButton.setAttribute("value", "Remove Friend");
      removeButton.innerText = "Remove Friend";
      removeButton.addEventListener("click", (e)=> {
        e.preventDefault();
        removeFriend(json.friends[i].username, e);
      })
      buttonTd.appendChild(removeButton);
      tr.appendChild(iconTd);
      tr.appendChild(friendTd);
      tr.appendChild(buttonTd);
      table.appendChild(tr);
    }

    div.appendChild(header);
    div.appendChild(table);

    return div;
  }

  // displays list of existing friends
  function renderFriends() {
    const FRIENDS_URL = `${USER_URL}/${document.querySelector("b").id}/friends`;
    let container = document.createElement("div");
    container.classList = "panel extra";

    fetch(FRIENDS_URL, {
      method: "GET",
      headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${localStorage.getItem('jwt_token')}`
      }
    })
      .then(resp => resp.json())
      .then(function (json) {

        let addFriendTable = addFriendsTable(json);
        let currentFriendsTable = currentFriends(json);
        container.appendChild(addFriendTable);
        container.appendChild(currentFriendsTable);

    })

    return container;
  }
