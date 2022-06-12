'use strict';
// Chain control fetch
fetch('https://cwwp2.dot.ca.gov/data/d3/cc/ccStatusD03.json')
  .then(response => response.json())
  .then(data => main(data, 1))
  .catch(error => console.error("There has been a problem with your fetch operation:",error));

// CCTV fetch
fetch('https://cwwp2.dot.ca.gov/data/d3/cctv/cctvStatusD03.json')
  .then(response => response.json())
  .then(data => main(data, 2))
  .catch(error => console.error("There has been a problem with your fetch operation:",error));

// Message Signs
fetch('https://cwwp2.dot.ca.gov/data/d3/cms/cmsStatusD03.json')
  .then(response => response.json())
  .then(data => main(data, 3))
  .catch(error => console.error("There has been a problem with your fetch operation:",error));

/*------------------------------------------------------------------------------------------------
Function Name:      chain_control
Description:        Take the json file and sets it to a new object array that is filtered
Returns:            cc_obj
Notes:              locationName, Longitude, Latitude, direction, route, inService, statusDate,
                    statusTime, status, statusDescription, milepost
------------------------------------------------------------------------------------------------*/
function chain_control(obj)
{
    // creates the object and array inside of the object
    let cc_obj = {
        data: []
    };

    // runs through every value in the original object
    for(let i in obj.data) {    

        let item = obj.data[i].cc;   
    
        // sends data from the original object to the new object
        cc_obj.data.push({
            "route"                : item.location.route,
            "locationName"         : item.location.locationName,
            "longitude"            : item.location.longitude,
            "latitude"             : item.location.latitude, 
            "direction"            : item.location.direction,
            "inService"            : item.inService,
            "statusDate"           : item.statusData.statusTimestamp.statusDate,
            "statusTime"           : item.statusData.statusTimestamp.statusTime,
            "status"               : item.statusData.status,
            "statusDescription"    : item.statusData.statusDescription,
            "milepost"             : item.location.milepost,
            "index"                : item.index
        });
    }

    cc_obj = filter(cc_obj, 1);


    

    return cc_obj;
}

/*------------------------------------------------------------------------------------------------
Function Name:      cctv
Description:        Take the json file and sets it to a new object array that is filtered
Returns:            tv_obj
Notes:              route, inService, milepost, streamingVideoURL
------------------------------------------------------------------------------------------------*/
function cctv(obj)
{
    // creates the object and array inside of the object
    let tv_obj = {
        data: []
    };
    
    // runs through every value in the original object
    for(let i in obj.data) {    
    
        let item = obj.data[i].cctv;   
        
        // sends data from the original object to the new object
        tv_obj.data.push({ 
            "route"                : item.location.route,
            "inService"            : item.inService,
            "milepost"             : item.location.milepost, 
            "streamingVideoURL"    : item.imageData.streamingVideoURL
        });
    }

    tv_obj = filter(tv_obj, 2);

    return tv_obj;
}

/*------------------------------------------------------------------------------------------------
Function Name:      message_sign
Description:        Take the json file and sets it to a new object array that is filtered
Returns:            mess_obj
Notes:              route, inService, milepost, phase1Line1, phase1Line2, phase1Line3, 
                    phase2Line1, phase2Line2, phase2Line3
------------------------------------------------------------------------------------------------*/
function message_sign(obj)
{
    // creates the object and array inside of the object
    let mess_obj = {
        data: []
    };
        
    // runs through every value in the original object
    for(let i in obj.data) {    
        
        let item = obj.data[i].cms;   
            
        // sends data from the original object to the new object
        mess_obj.data.push({ 
            "route"                : item.location.route,
            "milepost"             : item.location.milepost, 
            "phase1Line1"          : item.message.phase1.phase1Line1,
            "phase1Line2"          : item.message.phase1.phase1Line2,
            "phase1Line3"          : item.message.phase1.phase1Line3,
            "phase2Line1"          : item.message.phase1.phase2Line1,
            "phase2Line2"          : item.message.phase1.phase2Line2,
            "phase2Line3"          : item.message.phase1.phase2Line3,
        });
    }

    mess_obj = filter(mess_obj, 3);

    return mess_obj;
}

main();

/*------------------------------------------------------------------------------------------------
Function Name:      main
Description:        Driver Function for running functions
Returns:            
Notes:              
------------------------------------------------------------------------------------------------*/
function main(obj, index)
{
    var main_obj = {
        data: []
    };

    if(index == 1){
        // Chain Control Section
        var cc_obj = chain_control(obj);
    } else if(index == 2){
        // CCTV Section
        var tv_obj = cctv(obj);
    } else if(index == 3){
        // Message Sign section
        var mess_obj = message_sign(obj);
    } else {
        // Doesn't work because of scope
        main_obj = organizer(cc_obj, tv_obj, mess_obj, main_obj);
    }

    //console.log(main_obj);
}

/*------------------------------------------------------------------------------------------------
Function Name:      organizer
Description:        combines the three objects
Returns:            
Notes:              
------------------------------------------------------------------------------------------------*/
function organizer(cc_obj, tv_obj, mess_obj, main_obj)
{

    console.log(cc_obj.data[0]);




    // Needs to compare values and add similar ones to the same object
    /*let main_obj = {
        data: []
    };

    // Comparing cc to tv
    for(let i in cc_obj.data){
        for(let j in tv_obj.data){
            console.log(i);
            console.log(j);
        }
    }*/

    // Comparing cc to mess











    /*for(var i in obj.data) {    
        
        var item = obj.data[i].cms;   
            
        // sends data from the original object to the new object
        mess_obj.data.push({ 
            "route"                : item.location.route,
            "milepost"             : item.location.milepost, 
            "phase1Line1"          : item.message.phase1.phase1Line1,
            "phase1Line2"          : item.message.phase1.phase1Line2,
            "phase1Line3"          : item.message.phase1.phase1Line3,
            "phase2Line1"          : item.message.phase1.phase2Line1,
            "phase2Line2"          : item.message.phase1.phase2Line2,
            "phase2Line3"          : item.message.phase1.phase2Line3,
        });
    }*/


    return main_obj;
}
/*------------------------------------------------------------------------------------------------
Function Name:      filter
Description:        filters the data to only what is needed
Returns:            
Notes:              
------------------------------------------------------------------------------------------------*/
function filter(obj, index)
{
    if(index == 1){
        // Chain Control Section
        for(let i = obj.data.length -1; i >= 0; i--){     // goes through every value in the data set
                // Removes anything that doesn't have I-80 
            if(obj.data[i].route !== "I-80"){
                obj.data.splice(i,1);
                // Removes anything with an a at the end
            } else if(obj.data[i].index.split("").at(-1) == "a"){    
                obj.data.splice(i,1);
                // Removes anything that's out of service
            } else if(obj.data[i].inService !== "true"){
                obj.data.splice(i,1);
            }
        }
        } else if(index == 2){
        // CCTV Section
        for(let i = obj.data.length -1; i >= 0; i--){     // goes through every value in the data set
            if(obj.data[i].route !== "I-80"){
                obj.data.splice(i,1);
            } else if(obj.data[i].inService !== "true"){
                obj.data.splice(i,1);
            }
        }
    } else if(index == 3){
        // Message Sign section
        for(let i = obj.data.length -1; i >= 0; i--){     // goes through every value in the data set
            if(obj.data[i].route !== "I-80"){
                obj.data.splice(i,1);
            } 
        }
    }
    return obj
}