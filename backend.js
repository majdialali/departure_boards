const e = require('express');
const express=require('express');
const app= new express();
app.use(express.static("public"));
app.listen(3000, () => console.log('listening at port 3000'));



app.use(express.json({ limit: '1mb' }));

const datastore=require('nedb')
const database=new datastore("database.db")

database.loadDatabase()


app.post("/api_signin", (req, res)=>{
    console.log("ok")
    database.insert(req.body)
})

app.post('/api_login', (req, res) => {

    console.log(req.body)
    let ok_credentials=false

    //check if the credientails in te database if  
    database.find({}, (err, data) => {
      if (err) {
        res.end();
        return;
      }
      //console.log(data)
      //console.log(res.json(data))

      
      
      for(let i=0; i<data.length;i++ ){
        //login validation
        if(data[i].user_name == req.body.user_name && data[i].password ==req.body.password){
            console.log("Hurra")
            ok_credentials=true
            res.send({msg:"match"});
            //res.redirect(301, 'http://localhost:3000/index2.html')
            //res.set('http://localhost:3000/index2.html');
            //res.status(301).send()

            //post the name 
            //redirect to website
            
        }
      };
      if (!ok_credentials){ 
        res.send({msg:"no match"});
        return}
      //res.json(data);
    });

  
  });

    

