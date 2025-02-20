const express=require("express");
const app=express();
const port=8080;



app.set('view engine','ejs');
app.use(express.urlencoded({extended:true}));
app.use(express.static(path.join(__dirname,'views')));
app.use(express.static(path.join(__dirname,'public')));


app.get("/",(req,res)=>{
    res.send("working");
})

app.listen(port,()=>{
    console.log("App is listening on port 8080");
})