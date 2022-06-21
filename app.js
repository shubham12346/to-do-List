const express = require('express');
const bodParser = require('body-parser');
const dateq = require(__dirname+"/date.js");
const app = express();
const mongoose = require('mongoose');
const _ = require('lodash');

// creating moongose connection 
mongoose.connect("mongodb://localhost:27017/todoListDb",function()
{
    console.log("conected to todoListDb");
})

// defining a schema 
const schema = mongoose.Schema({
    name:String
})

const itemSchema = mongoose.Schema({
    name :String,
    item :[schema]
})


//creating a collection item
const listD = mongoose.model("List",schema);

//creating a collection  table
const Table = mongoose.model("Table",itemSchema);

const item1 = new listD({
    name :"Welcome to our todo list "
})
const item2 = new listD({
    name: "Hit the + button to add a new item"
})
const item3 = new listD({
    name:" hit - to this the element "
})

const defaultItems = [item1,item2,item3];
// listD.insertMany(defaultItems,function(err)
// {
//     if(err)
//     {console.log(err)}
//     else{
//         console.log("itmes added ");
//     }
// })



app.set('view engine','ejs');
app.use(bodParser.urlencoded({extended:true}));
app.use(express.static("public"));





app.get("/",function(req,res)
{
 listD.find({},function(err,foundData)
 {
    if(foundData.length === 0)
    {
            listD.insertMany(defaultItems,function(err)
            {
                if(err)
                {
                    console.log(err)
                }
                else{
                    console.log("itmes added ");
                    res.redirect("/");
                }
            })

    }
  
     
    res.render("list",{nameDay : "today", fruitList:foundData});
 })
 

})



app.post("/", function(req, res){

  const content = req.body.content;
  const listName = req.body.title;

  const item4 = new listD({
    name:content
})
console.log(listName);
 if ( listName === "today"){
    item4.save();
    res.redirect("/");
  }else {
    Table.findOne({name: listName}, function(err, foundList){
        if(!err)
        {
             foundList.item.push(item4);
      foundList.save();
      res.redirect("/" + listName);

        }else{
            console.log(err);
        }
     
    });
  }
  
});





app.post("/delete",function(req,res){


 console.log(req.body.tableName);
 tableName =req.body.tableName;
 id= req.body.checkb;
 if(tableName === "today")
 {
     listD.findByIdAndRemove(req.body.checkb , function(err)
    {
        if(err)
        {
            console.log(err);
        }else{
            console.log("sucess");
        }
        res.redirect("/");
    })

 }else{
   
 Table.findOneAndUpdate({name:tableName},{$pull:{item :{_id:id}}},function(err,foundList)
 {

    if(!err)
    {
        res.redirect("/"+tableName);
    }
 })

 }
 
   
    

})


app.get("/:newTopic",function(req,res)
{
    const newTopic = _.capitalize(req.params.newTopic);
    console.log(newTopic);
    
    Table.findOne({name:newTopic},function(err,result)
    {
        if(!err)
        {
             if(result)
                {
                    console.log(result);
                    res.render("list",{nameDay : newTopic, fruitList:result.item});
                  
                }else{
                            const newList = new Table({
                        name :req.params.newTopic
                    })
            newList.save();
            res.redirect("/"+newTopic);

        }
          

        }
       
    })

   


})


app.listen(8080,function()
{
    console.log("Your server is running at port 30000");
})