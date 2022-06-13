
//................sign in / log in.......................


document.getElementById("signIn_btn").onclick=async ()=>{
   
    const inputs_si=document.querySelectorAll(".data_si")
    const errors_si=document.querySelectorAll(".errorText_si")
    
    const data={user_name: inputs_si[0].value, epost:inputs_si[1].value,password:inputs_si[2].value,last_search:""}
    let emptyFields=false

    let submit_msg=document.querySelector("#submitText_si")
    
    for(let i=0; i<inputs_si.length;i++ ){

        //if the user leaves one or more empty fields
        if(inputs_si[i].value==""){
            emptyFields=true
            errors_si[i].innerText="Fill in this field!"
            submit_msg.innerText="" 
            continue
        }
        errors_si[i].innerText=""   
    }
    
    if (emptyFields==true){return} 

    try {
        
         fetch("/api_signin",{
            method:"POST", 
            headers: {'Content-Type': 'application/json'},     
            body: JSON.stringify(data)
        });

    
    inputs_si.forEach(e => {e.value=""});    
    submit_msg.style.color="green"
    submit_msg.innerText="Done! You can log in now."
    //
    //       
    } catch (error) {

        submit_msg.style.color="red"
        submit_msg.innerText="Sorry, error from the server!, Try again later."
        console.error(error)
      
    }
    
};


document.getElementById("logIn_btn").onclick=async ()=>{
   
   const inputs_li=document.querySelectorAll(".data_li")
   const errors_li=document.querySelectorAll(".errorText_li")
   const data={user_name: inputs_li[0].value, password:inputs_li[1].value}
   
   let emptyFields=false

   let submit_msg=document.querySelector("#submitText_li")
   
   for(let i=0; i<inputs_li.length;i++ ){

       //if the user leaves one or more empty fields
       if(inputs_li[i].value==""){
           emptyFields=true
           errors_li[i].innerText="Fill in this field!"
           submit_msg.innerText="" 
           continue
       }
       errors_li[i].innerText=""   
   }
   
   if (emptyFields==true){return} 
   
   fetch("/api_login",{
           method:"POST", 
           headers: {'Content-Type': 'application/json'},     
           body: JSON.stringify(data)}
    ).then((res) => { return res.json()}
            
    ).then((res_Jsn) => {
                //console.log(res_Jsn)
            if (res_Jsn.msg =="no match") {
                submit_msg.style.color="red"
                submit_msg.innerText="Wrong password or user name, try again!"
                
            }else{
                inputs_li.forEach(e => {e.value=""});    
                submit_msg.style.color="green"
                submit_msg.innerText="Done!"
                window.location.href = "http://localhost:3000/dep_boards.html";
            }
            
      }  
                
    ).catch((error) => {
            submit_msg.style.color="red"
            submit_msg.innerText="Wrong password or user name, try again!"
            console.log(error)
       });

    
};

