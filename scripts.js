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

/*<div class="card text-white bg-primary mb-3">
            <div class="card-body">
              <h4 class="card-title">Primary card title</h4>
              <p class="card-text">Some quick example text to build on the card title and make up the bulk of the card's content.</p>
            </div>
          </div>*/

    // goes through every value in data
    for(let i in newArray){
        let name = newArray[i].cc.location.locationName;
        let stats = newArray[i].cc.statusData.statusDescription;
        let bound = newArray[i].cc.location.direction;
        let update = newArray[i].cc.statusData.statusTimestamp;

        //console.log(obj.data[i]); //remove eventually

        // html element creation section
        let container = document.createElement("div");
        let card_main = document.createElement("div");
        let card_body = document.createElement("div");
        let head = document.createElement("h1");
        let status = document.createElement("p");
        let time = document.createElement("p");
        
        // Text attributes section
        container.setAttribute("class", "container");
        card_main.setAttribute("class", "card text-white bg-primary mb-3");
        card_body.setAttribute("class", "card-body");
        head.setAttribute("class", "card-title");
        status.setAttribute("class", "text-info");
        time.setAttribute("class", "text-info");

        // data filling section
        head.innerHTML = name + ": " + bound + "bound";
        status.innerHTML = stats;
        time.innerHTML = "Last updated: Date: " + update.statusDate + " Time: " + time_converter(update.statusTime);

        // append to page section
        document.body.appendChild(container);
        container.appendChild(card_main);
        card_main.appendChild(card_body);
        card_body.appendChild(head);
        card_body.appendChild(status);
        card_body.appendChild(time);
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


  


  // To do 
  // Add google maps links to the cordinates for each of the locations for reference



  // if first two digits of post mile are the same && direction is the same display streaming url