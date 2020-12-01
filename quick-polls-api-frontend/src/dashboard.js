// creates container for dashboard item
function createContainerForMenu(name, icon, color) {
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

    const clearDiv = document.createElement("div");
    clearDiv.classList ="clear";

    const title = document.createElement("h4");
    title.innerHTML = name;
    
    containerDiv.appendChild(leftDiv);
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
    header.innerHTML = "General Chart";
    thirdDiv.appendChild(header);

    const canvas = document.createElement("canvas");
    canvas.id = "myChart";
    thirdDiv.appendChild(canvas);
    
    let myChart = canvas.getContext("2d");

    let massPopChart = new Chart(myChart, {
      type: "bar", // pie, bar, horizontalBar, doughnut
      data: {
        labels: ["Participation", "Winner polls", "Loser polls"],
        datasets: [{
          data: [json.polls_voted_on, json.winner_polls, json.loser_polls],
          backgroundColor: ["#2196F3", "#4CAF50", "#f44336"]
        }]
      },
      options: {
        title: {
          display: true,
          text: "Aggregated poll data (%)"
        },
        legend: {
          display: false
        },
        scales: {
          yAxes: [{
              ticks: {
                  beginAtZero: true
              }
          }]
      }
      }
    })

    let linksDiv = createDivWithLinksForChartTypes();
    linksDiv.querySelectorAll(".chart-link").forEach(a => {
      a.addEventListener("click", (e) => {
        massPopChart.destroy();
        massPopChart = new Chart(myChart, {
          type: a.id, // pie, bar, horizontalBar, doughnut
          data: {
            labels: ["Participation", "Winner polls", "Loser polls"],
            datasets: [{
              label: "Aggregated poll data (%)",
              data: [json.polls_voted_on, json.winner_polls, json.loser_polls],
              backgroundColor: ["#2196F3", "#4CAF50", "#f44336"]
            }]
          },
          options: {
            title: {
              display: true,
              text: "Aggregated poll data (%)"
            },
            legend: {
              display: false
            },
            scales: {
                yAxes: [{
                    ticks: {
                        beginAtZero: true
                    }
                }]
            }
          }
        })    
      })
    })
    thirdDiv.appendChild(linksDiv);
    document.querySelector(".row-padding").appendChild(thirdDiv);
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

      if (i === 0) {
          icon.classList = "fa fa-user-plus text-brown large";
          contentTd.innerHTML = `You have been added to ${json.added_polls} polls.`; 
          tr.style.backgroundColor = "#F0F0F0";
      } else if (i === 1)  {
          icon.classList = "fa fa-plus-square text-orange large";
          contentTd.innerHTML = `You have created ${json.created_polls} polls.`
      } else if (i === 2) {
          icon.classList = "fas fa-chart-pie text-green large";
          contentTd.innerHTML = `You have ${json.pending_polls} pending polls and ${json.closed_polls} closed polls.`; 
          tr.style.backgroundColor = "#F0F0F0";
      } else if (i === 3) {
          icon.classList = "fas fa-vote-yea text-red large";
          contentTd.innerHTML = `You have voted on ${dataHash.votes.length} polls.`;
      } else if (i === 4) {
          icon.classList = "fa fa-users text-blue large";
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

  // creates footer with link to github repository
  function createFooter() {
    let footer = document.createElement("footer");
    let p = document.createElement("p");
    let i = document.createElement("i");
    let a = document.createElement("a");

    i.classList = "fab fa-github";
    a.href = "https://github.com/dpataki92/quick-polls-api";
    a.target = "_blank";
    a.innerText = " GitHub";
    a.id = "footer-link";
    p.appendChild(i);
    p.appendChild(a);

    footer.appendChild(p);
    document.querySelector(".main").appendChild(footer);
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
      b.innerHTML = `Welcome, ${dataHash.username}!`
      h4.id = "welcome"
      h4.appendChild(b);

      // inserting welcome header containing user's name
      mainDiv.insertBefore(h4, mainDiv.querySelector(".panel"));
    }
    
    // array contaiing the individual attirubtes of all dashboard item container
    const containers = [
        {
            name: "Create a Poll",
            icon: "plus",
            color: "orange",
            userNum: null,
            listener: pollForm
        },

        {
            name: "Pending Polls",
            icon: "bar-chart-o",
            color: "green",
            userNum: dataHash.polls.filter(p => p.status === "pending").length,
            listener: listPendingForms
        },

        {
            name: "Closed Polls",
            icon: "hourglass-end",
            color: "red",
            userNum: dataHash.polls.filter(p => p.status === "closed").length,
            listener: listClosedPolls
        },

        {
            name: "Friends",
            icon: "users",
            color: "blue",
            userNum: dataHash.friends.length,
            listener: renderFriends
        }

    ]

    // renders diagram of aggregated user data
    renderAggregatedPollDiagram(json);

    // renders list of additional aggregated user data
    renderAggregatedUserData(json, dataHash);

    // creates footer with github repo link
    createFooter();

    // displays the 4 container for menu items and allows users to directly go from one item to another
    if (!document.querySelector(".quarter")) {

      for (let i = 0; i < containers.length; i++) {

        const container = createContainerForMenu(containers[i]["name"], containers[i]["icon"], containers[i]["color"], containers[i]["userNum"])
        mainDiv.insertBefore(container, mainDiv.querySelector(".panel"));
        container.addEventListener("click", (e)=> {

        if (document.querySelector(".row-padding.normal").innerHTML != "") {

          document.getElementById(containers[i]["name"]).querySelector("h4").innerHTML = "Back to Dashboard";
          let el = containers[i].listener(dataHash);
          document.querySelector(".row-padding.normal").innerHTML = "";          
          mainDiv.insertBefore(el, document.querySelector(".panel"));
          
        } else {

          let openContainer;
          Array.from(document.querySelectorAll(".quarter")).forEach(element => {
            if (element.innerText === "Back to Dashboard" && container.innerText != "Back to Dashboard") {
              openContainer = element;
            }
          });

          if (openContainer) {
            document.querySelector(".extra").remove();
            document.getElementById(containers[i]["name"]).querySelector("h4").innerHTML = "Back to Dashboard";
            openContainer.querySelector("h4").innerHTML = openContainer.firstChild.id;
            let el = containers[i].listener(dataHash);
            mainDiv.insertBefore(el, document.querySelector(".panel"));

          } else {
            document.querySelector(".extra").remove();
            document.getElementById(containers[i]["name"]).querySelector("h4").innerHTML = containers[i]["name"];
            renderDashBoard(json, dataHash);
          }
        }
      })
  }
  }
}