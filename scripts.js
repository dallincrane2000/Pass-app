// main page https://cwwp2.dot.ca.gov/10bfd803-b808-41fd-9e81-9b1a9f1f1832
// google maps page https://developers.google.com/maps/documentation/javascript/examples/marker-simple#maps_marker_simple-javascript
// starting point for videos https://codepen.io/furkankinyas/pen/vYZEXgB


fetch('https://cwwp2.dot.ca.gov/data/d3/cc/ccStatusD03.json')
  .then(response => response.json())
  .then(data => processing(data))
  .catch(error => console.error("There has been a problem with your fetch operation:",error));

  function processing(obj)
  {
    // Filters array to only values we want
    newArray = filter(obj);

    // Sorts new array from most recently updated to least
    newArray.sort(function(a,b){
      return new Date(b.cc.statusData.statusTimestamp.statusDate)
      - new Date(a.cc.statusData.statusTimestamp.statusDate);
    })

    // goes through every value in data
    for(let i in newArray){
        let name = newArray[i].cc.location.locationName;
        let stats = newArray[i].cc.statusData.statusDescription;
        let bound = newArray[i].cc.location.direction;
        let update = newArray[i].cc.statusData.statusTimestamp;
        let stats_code = newArray[i].cc.statusData.status;

        // html element creation section
        let container = document.createElement("div");
        let card_main = document.createElement("div");
        let card_body = document.createElement("div");
        let head = document.createElement("h1");
        let status = document.createElement("p");
        let time = document.createElement("p");
        let refresh = document.createElement("button");
        
        // Text attributes section
        container.setAttribute("class", "container");
        card_main.setAttribute("class", "card text-white bg-primary mb-3");
        card_body.setAttribute("class", "card-body");
        head.setAttribute("class", "card-title");
        refresh.setAttribute("type", "button");
        refresh.setAttribute("class", "btn btn-primary");

        // change color based on info presented
        if(stats_code == "R-0"){
          time.setAttribute("class", "text-info");
          status.setAttribute("class", "text-info");
        } else {
          time.setAttribute("class", "text-danger");
          status.setAttribute("class", "text-danger");
        }
        

        // data filling section
        head.innerHTML = name + ": " + bound + "bound";
        status.innerHTML = stats;
        time.innerHTML = "Last updated: Date: " + update.statusDate + " Time: " + time_converter(update.statusTime);
        refresh.innerHTML = "Refresh";

        // Event Listeners
        refresh.addEventListener("click", function(){
          window.location.reload(true);
        });

        // append to page section
        document.body.appendChild(container);
        container.appendChild(card_main);
        card_main.appendChild(card_body);
        card_body.appendChild(head);
        card_body.appendChild(status);
        card_body.appendChild(time);
        card_body.appendChild(refresh);
      }
 }

// filter function
function filter(obj){
    let newArray = obj.data.filter((item) => item.cc.location.route == "I-80"
      && item.cc.inService == "true" && item.cc.index.split("").at(-1) != "a");
    return newArray;
}

  // Converts military time to standard
  function time_converter(time){
    time = time.split(':'); // convert to array
        
    // fetch
    var hours = Number(time[0]);
    var minutes = Number(time[1]);
    var seconds = Number(time[2]);
        
    // calculate
    var timeValue;
        
    if (hours > 0 && hours <= 12) {
        timeValue= "" + hours;
    } else if (hours > 12) {
        timeValue= "" + (hours - 12);
    } else if (hours == 0) {
        timeValue= "12";
    }
        
    timeValue += (minutes < 10) ? ":0" + minutes : ":" + minutes;  // get minutes
    timeValue += (seconds < 10) ? ":0" + seconds : ":" + seconds;  // get seconds
    timeValue += (hours >= 12) ? " P.M." : " A.M.";  // get AM/PM
        
    return timeValue;
  }


  // if first two digits of post mile are the same && direction is the same display streaming url