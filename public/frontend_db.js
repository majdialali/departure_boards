
//................departure boards.......................


async function geocoder_api(inp) {
    
    const url=`https://api.entur.io/geocoder/v1/autocomplete?text=${inp}&lang=en`

    try {
        const res = await fetch(url,{headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'ET-Client-Name': ["norsk luft ambulanse","caseoppgave"]
        }})
        const obj = await res.json() 
        return obj;    
    } catch (error) {

        const inpt_lbl= document.querySelector("#inp_error")
        inpt_lbl.innerText="Sorry, Network prolbem. Try again later!"
        console.error(error);
    }

}
  

async function dpBoards_api(stopPlaceID){

  
    const query = `{
    stopPlace(id:"${stopPlaceID}") {
        name
        id
        estimatedCalls(numberOfDepartures: 5, whiteListedModes: [bus]) {
        expectedDepartureTime
        aimedDepartureTime
        destinationDisplay {
            frontText
        }
        serviceJourney {
            line {
            publicCode
            transportMode
            }
        }
        }
    }
    }
    `
    try {
        const res=await fetch('https://api.entur.io/journey-planner/v3/graphql', {
            method: 'POST',
            headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'ET-Client-Name': ["norsk luft ambulanse","caseoppgave"]
            },
            body: JSON.stringify({ query })
        })
        const obj = await res.json() 

        return obj

    } catch (error) {
        const inpt_lbl= document.querySelector("#inp_error")
        document.querySelector("#inp_error").innerText="Wrong name, write again!"  
        console.error(error);
    }

}


function show(array){

    array.forEach(e => {
        let menu = document.createElement("details");
        let header = document.createElement("summary");
        const aimedDTime = document.createElement("p");
        const expectedDTime = document.createElement("p");
        header.style.fontWeight = "550" //bold header

        header.innerText =  e.serviceJourney.line.publicCode +" "+ e.destinationDisplay.frontText ;
        aimedDTime.innerText = "  aimed time: "+e.aimedDepartureTime
        expectedDTime.innerText = "  expected time: "+ e.expectedDepartureTime
        //append all children of details
        menu.append(header,aimedDTime,expectedDTime)
        document.querySelector("#busses_div").appendChild(menu)
    });
   
}


async function main() {
    const user_inp= document.querySelector("#inp").value
    
    const geo_data = await geocoder_api(user_inp);
    if (geo_data.features[0]==null){
        const inpt_lbl= document.querySelector("#inp_error")
        inpt_lbl.innerText="Not found, Check spelling!"
        return
    }
    const stopPlaceID =geo_data.features[0].properties["id"]
    
    const dp_data = await dpBoards_api(stopPlaceID)
    console.log(stopPlaceID)
    const sPlace=dp_data.data.stopPlace

    const inpt_lbl= document.querySelector("#inp_error")

    if(stopPlaceID[4]=="G"){
        
        inpt_lbl.innerText="Be more spesific. You write a name of group of bus stops!"
        return
    }
    else if(typeof  geo_data.features[0] == 'undefined' || sPlace==null ){     
        inpt_lbl.innerText="Wrong name, write again!"
        return
    }
    
    const busses_dep=sPlace.estimatedCalls
    const len=busses_dep.length
    if(len==0){
        inpt_lbl.innerText="Det går ingen buss herfra!"
        return   
    }

    inpt_lbl.innerText="" //remove error message if found

    //show the user the returned list of the availabe busses
    show(busses_dep)
    
    
}  

document.getElementById("btn").onclick=async ()=>{
    // to avoid redundancy when clicking on the button more than one time 
    const div=document.querySelector("#busses_div");
    div.textContent=""

    main();
};
 





