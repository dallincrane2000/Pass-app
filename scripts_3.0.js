'use strict';
// Ideas section
// 1) create a starting page that uses cookies to detect if it's the users first time
//    then make a hello and description page and a get started button


// creates button and runs the code when pressed
// Will be used for reloading so I don't have to reload the whole page
let btn = document.createElement("button");
btn.innerHTML = "Submit";
btn.type = "submit";
btn.name = "formBtn";
btn.onclick = function () {
    fetching();
    document.body.removeChild(btn);
};
document.body.appendChild(btn);
/*------------------------------------------------------------------------------------------------
Function Name:      fetching()
Description:        fetches the json files for cc, cctv, and cms
Returns:            NULL
Notes:              
------------------------------------------------------------------------------------------------*/
async function fetching(){
    // creates loading spinner
    let container = document.createElement("div");
    container.className = "d-flex justify-content-center"
    document.body.appendChild(container);
    let loader = document.createElement("div");
    loader.className = "spinner-border text-primary"
    loader.setAttribute("role", "status");
    container.appendChild(loader);

    // fetches Chain Control
    const cc = await fetch('https://cwwp2.dot.ca.gov/data/d3/cc/ccStatusD03.json')
    .then((res) => res.json());
  
    // fetches cctv
    const tv = await fetch('https://cwwp2.dot.ca.gov/data/d3/cctv/cctvStatusD03.json')
    .then((res) => res.json());
  
    // fetches messaging system
    const cms = await fetch('https://cwwp2.dot.ca.gov/data/d3/cms/cmsStatusD03.json')
    .then((res) => res.json())

    // Weather eventually https://www.weatherapi.com/my/

    // removes the loading bar
    document.body.removeChild(container);
    
    // sets all the data
    const allData = Promise.all([cc, tv, cms]);
    
    // sends data to main function
    allData.then((res) => main(res));

}

/*------------------------------------------------------------------------------------------------
Function Name:      main()
Description:        driver function
Returns:            NULL
Notes:              
------------------------------------------------------------------------------------------------*/
function main(obj){

    // filters the json files
    obj = filter(obj);

    // sort data by date and time of chain control
    obj[0].data.sort(function(a,b){
    return new Date((b.cc.statusData.statusTimestamp.statusDate))
    - new Date((a.cc.statusData.statusTimestamp.statusDate));
    });
    // Display data
    display(obj);


    console.log(obj);


}

/*------------------------------------------------------------------------------------------------
Function Name:      filter
Description:        filters the data to only what is needed
Returns:            obj
Notes:              
------------------------------------------------------------------------------------------------*/
function filter(obj)
{
    for(var i in obj){
        if(i == 0){
            // Chain Control Section
            for(var j = obj[i].data.length -1; j >= 0; j--){     // goes through every value in the data set
                    // Removes anything that doesn't have I-80 
                if(obj[i].data[j].cc.location.route !== "I-80"){
                    obj[i].data.splice(j,1);
                    // Removes anything with an a at the end
                } else if(obj[i].data[j].cc.index.split("").at(-1) == "a" || obj[i].data[j].cc.index.split("").at(-1) == "b" || obj[i].data[j].cc.index.split("").at(-1) == "c"){    
                    obj[i].data.splice(j,1);
                    // Removes anything that's out of service
                } else if(obj[i].data[j].cc.inService !== "true"){
                    obj[i].data.splice(j,1);
                }
            }
            } else if(i == 1){
            // CCTV Section
            for(var j = obj[i].data.length -1; j >= 0; j--){     // goes through every value in the data set
                if(obj[i].data[j].cctv.location.route !== "I-80"){
                    obj[i].data.splice(j,1);
                } else if(obj[i].data[j].cctv.inService !== "true"){
                    obj[i].data.splice(j,1);
                }
            }
        } else if(i == 2){
            // Message Sign section
            for(var j = obj[i].data.length -1; j >= 0; j--){     // goes through every value in the data set
                if(obj[i].data[j].cms.location.route !== "I-80"){
                    obj[i].data.splice(j,1);
                } 
            }
        }
    }

    return obj
}

/*------------------------------------------------------------------------------------------------
Function Name:      display
Description:        displays the data
Returns:            obj
Notes:              Needs work
------------------------------------------------------------------------------------------------*/
function display(obj)
{
    for(let i in obj[0].data){
        let location = obj[0].data[i].cc.location;
        let chain_data = obj[0].data[i].cc.statusData;
        let google_url = "https://www.google.com/maps/search/?api=1&query=" + location.latitude + "%2c" + location.longitude;

// main container section
        let container = document.createElement("div");
        container.className = "container";
        document.body.appendChild(container);
// nested container section
            let card_main = document.createElement("div");
            card_main.className = "card text-white bg-primary mb-3";
            container.appendChild(card_main);
// container body section
                let card_body = document.createElement("div");
                card_body.className = "card-body"
                card_main.appendChild(card_body);
// header section
                // Creation
                    let title = document.createElement("a");
                // set attributes
                    title.setAttribute("href", google_url);
                    title.className = "card-title text-decoration-none h1";
                    title.setAttribute("target", "_blank");
                // fill in data
                    title.innerHTML = location.locationName + ": " + location.direction + "bound";
                // add to page
                    card_body.appendChild(title);
// chain info section
                // creation
                    let chain_info = document.createElement("p");
                // set attributes
                    if(chain_data.status == "R-0"){
                        chain_info.className = "text-info mt-3";
                    } else {
                        chain_info.className = "text-danger mt-3"
                    }
                // fill in data
                    chain_info.innerHTML = chain_data.statusDescription;
                // add to page
                    card_body.appendChild(chain_info);
// last updated section
                // Creation
                    let last_updated = document.createElement("p");
                // set attributes
                    last_updated.className = "text_info";
                // fill in data
                    last_updated.innerHTML = chain_data.statusTimestamp.statusDate + " " + time_converter(chain_data.statusTimestamp.statusTime);
                // add to page
                    card_body.appendChild(last_updated);
// Horizontal Rule Section
                // Creation
                    let hr = document.createElement("hr");
                    card_body.appendChild(hr);
// CCTV button section
                for(let j in obj[1].data){
                    if(parseInt(obj[1].data[j].cctv.location.milepost, 10) == parseInt(location.milepost, 10) && location.direction == obj[1].data[j].cctv.location.direction){
                    // Creation
                        var cctv_button = document.createElement("button");
                    // set attributes
                        cctv_button.className = "btn btn-primary collapsed";
                        cctv_button.setAttribute("type", "button");
                        cctv_button.setAttribute("data-toggle", "collapse");
                        cctv_button.setAttribute("data-target", "#cctv" + j);
                    // fill in data
                        cctv_button.innerHTML = "CCTV CAMERA";
                    // add to page
                        card_body.appendChild(cctv_button);
                    }
                }
// message sign button section
                for(let j in obj[2].data){
                    if(parseInt(obj[2].data[j].cms.location.milepost, 10) == parseInt(location.milepost, 10) && location.direction == obj[2].data[j].cms.location.direction){
                    // Creation
                        let cms = document.createElement("button");
                    // set attributes
                        cms.className = "btn btn-primary";
                        cms.setAttribute("type", "button");
                        cms.innerHTML = "MESSAGE SIGN";
                    // add to page
                        card_body.appendChild(cms);
                    }
                }
// message sign button section
                // Creation
                let weather_btn = document.createElement("button");
                // set attributes
                    weather_btn.className = "btn btn-primary";
                    weather_btn.setAttribute("type", "button");
                    weather_btn.innerHTML = "WEATHER";
                // add to page
                    card_body.appendChild(weather_btn);
// refresh button section
                // Creation
                    let refresh_button = document.createElement("button");
                // set attributes
                    refresh_button.setAttribute("type", "button");
                    refresh_button.className = "btn btn-primary float-end";
                    refresh_button.innerHTML = "REFRESH";
                // add to page
                    card_body.appendChild(refresh_button);
// CCTV container section
                // Creation
                    let cctv_data = document.createElement("div");
                // set attributes
                    cctv_data.className = "text_info collapse";
                    for(let j in obj[1].data){
                        if(parseInt(obj[1].data[j].cctv.location.milepost, 10) == parseInt(location.milepost, 10) && location.direction == obj[1].data[j].cctv.location.direction){
                            cctv_data.setAttribute("id", "cctv" + j);
                        }
                    }
                // add to page
                    card_body.appendChild(cctv_data);
// CCTV video Section
                // Creation
                    let video = document.createElement("video");
                // set attributes
                    for(let j in obj[1].data){
                        if(parseInt(obj[1].data[j].cctv.location.milepost, 10) == parseInt(location.milepost, 10) && location.direction == obj[1].data[j].cctv.location.direction){
                            video.setAttribute("id", "cctv" + j);
                        }
                    }
                    video.className = "video-js";
                    video.setAttribute("data-setup", "{}");
                    video.setAttribute("controls", "controls");
                // add to page
                    cctv_data.appendChild(video);
// video-js Section
                    for(let j in obj[1].data){
                        if(parseInt(obj[1].data[j].cctv.location.milepost, 10) == parseInt(location.milepost, 10) && location.direction == obj[1].data[j].cctv.location.direction){
                            var myPlayer = videojs('cctv' + j++);
                            myPlayer.src({type: "application/x-mpegURL", src: obj[1].data[j].cctv.imageData.streamingVideoURL});
                        }
                    }
                    

    
// <video id="some-player-id" class="video-js" data-setup="{}" controls></video>
    }
}

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