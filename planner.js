//REQUIRE the modules

const express=require('express');
const path=require("path");
const bodyParser = require("body-parser");
const MongoClient = require('mongodb').MongoClient;
const uri="mongodb+srv://admin-amala:Smash1551@cluster0-yzaqe.mongodb.net/iplannerDB?retryWrites=true&w=majority";
const assert = require('assert');
let ejs=require('ejs');
const app=express();

app.set("view engine","ejs");
app.use(express.static(__dirname+"/public"));
app.use(express.static(__dirname+"/jsscript"));
app.use(bodyParser.urlencoded({extended:true}));

//MONGODB connection

const client=new MongoClient(uri,{ useUnifiedTopology: true ,useNewUrlParser: true });
client.connect(function(err) {
  assert.equal(null, err);
  console.log("Connected successfully to server");
  db = client.db("iplannerDB");
});

//GET Requests

app.get("/home",function(req,res){
  res.sendFile(path.join(__dirname,"/homepage1.html"));
});

app.get("/register",function(req,res){
  res.sendFile(path.join(__dirname,"/taskListRegister.html"));
});

app.get("/login",function(req,res){
  res.sendFile(path.join(__dirname,"/taskListLogin.html"));
});

//POST Requests

app.post("/register",function(req,res){
  var n=req.body.name;
  var e=req.body.email;
  var p1=req.body.pass;
  var p2=req.body.pass2;
  if(p1==p2){
    var data={name:n,email:e,password:p1,tasks:[],archive:[]};
    db.collection('newusers').insertOne(data,function(err,r){
      if(err){
        console.log(err);
        res.render("invreg");
      //  res.send("Registration unsuccessful");
      }
      else{
          console.log(p1+" "+p2);
          console.log("user home page");
          res.render("userHomePage",{name:n,em:e,pw:p1});
      }
    });
  }
  else{
    res.sendFile(path.join(__dirname,"taskListRegister.html"));
  }
});

app.post("/login",function(req,res){
  var em=req.body.email;
  var pw=req.body.pass;
  db.collection('newusers').findOne({email:{$eq: em},password:{$eq:pw}},function(err,r){
    if(err){
      console.log(err);
    }
    else if(r==null){
      res.render("invlogin");
    }
      else{
        var name=r.name;
        res.render("userhomepage",{name:name,em:em,pw:pw});
      }
  });
});

app.post("/userHomePage",function(req,res){
  var t=req.body.title;
  var d=req.body.ddate;
  var l=req.body.lab;
  var s=req.body.stat;
  var em=req.body.email;
  var pw=req.body.pwd;
  var name=req.body.name;
  console.log(em+" "+pw);
  var t1={title:t,ddate:d,label:l,status:s};
  console.log(t1);
   if(t!='null' && d!='null' && l!='null' && s!='null'){
     db.collection('newusers').updateOne({email:{$eq: em},password:{$eq:pw}},{$push:{tasks:t1}},function(err,r){
          if(err){console.log(err);}});
   }
   res.render("userHomePage",{name:name,em:em,pw:pw});
});

app.post("/usertasks",function(req,res){
  var n=req.body.name;
  var e=req.body.email;
  var p=req.body.pwd;
  db.collection('newusers').findOne({email:e,password:p},function(err,r){
    if(err){
      console.log(err);
    }else{
    res.render("usertasks",{name:n,em:e,pw:p,tasks:r.tasks});
    }
  });
});

app.post("/taskdel",function(req,res){
  var t=req.body.title;
  var t2=t.split("_").join(" ");
  var d=req.body.date;
  var l=(req.body.lab).split("_").join(" ");
  var s=(req.body.status).split("_").join(" ");
  var em=req.body.email;
  var pw=req.body.pwd;
  var name=req.body.name;
  console.log("Deleted: "+t2+" "+d+" "+l+" "+s);
  db.collection('newusers').updateOne({email:em,password:pw},{$pull :{tasks:{title:t2,ddate:d,label:l,status:s}}});
  db.collection('newusers').findOne({email:em,password:pw},function(err,r){
    if(err){
      console.log(err);
    }else{
    res.render("usertasks",{name:name,em:em,pw:pw,tasks:r.tasks});
    }
  });
});

app.post("/taskedit",function(req,res){
  var t=req.body.title;
  var t2=t.split("_").join(" ");
  var d=req.body.date;
  var l=(req.body.lab).split("_").join(" ");
  var s=(req.body.status).split("_").join(" ");
  var em=req.body.email;
  var pw=req.body.pwd;
  var name=req.body.name;
  db.collection('newusers').findOne({email:em,password:pw},function(err,r){
    if(err){console.log(err);}
    else{
      var Tasks=r.tasks;
      Tasks.forEach(function(task) {
        if(task.title==t2 && task.ddate==d && task.label==l && task.status==s)
        {
          console.log(task.title+" "+task.ddate+" "+task.label+" "+task.status);
          var t3=task.title.split(" ").join("_");
          var l3=task.label.split(" ").join("_");
          var s3=task.status.split(" ").join("_");
          console.log(t3+" "+l3+" "+s3);
          res.render("taskedit",{name:name,em:em,pw:pw,title:t3,ddate:d,lab:l3,stat:s3});
        }
      });
    }
  });
});

app.post("/taskeditfinal",function(req,res){
  var t=req.body.title;
  var d=req.body.ddate;
  var l=req.body.lab;
  var s=req.body.stat;
  var em=req.body.email;
  var pw=req.body.pwd;
  var name=req.body.name;
  var ot=(req.body.oldtitle).split("_").join(" ");
  var od=req.body.olddate;
  var ol=(req.body.oldlabel).split("_").join(" ");
  var os=(req.body.oldstat).split("_").join(" ");
  var t1={title:t,ddate:d,label:l,status:s}
  console.log("New: "+t+" "+d+" "+l+" "+s);
  console.log("Old: "+ot+" "+od+" "+ol+" "+os);
  var otask={title:ot,ddate:od,label:ol,status:os};
  db.collection('newusers').updateOne({email:em,password:pw},{$pull :{tasks:{title:ot,ddate:od,label:ol,status:os}}});
  db.collection('newusers').updateOne({email:{$eq: em},password:{$eq:pw}},{$push:{tasks:t1}},function(err,r){
       if(err){console.log(err);}});
  db.collection('newusers').findOne({email:em,password:pw},function(err,r){
    if(err){
      console.log(err);
    }else{
    res.render("usertasks",{name:name,em:em,pw:pw,tasks:r.tasks});
    }
  });
});

app.post("/taskarchive",function(req,res){
  var n=req.body.name;
  var e=req.body.email;
  var p=req.body.pwd;
  var t=(req.body.title).split("_").join(" ");
  var d=(req.body.date);
  var l=(req.body.lab).split("_").join(" ");
  var s=(req.body.status).split("_").join(" ");
  var t2={title:t,ddate:d,label:l,status:s};
  db.collection('newusers').updateOne({email:e,password:p},{$pull :{tasks:{title:t,ddate:d,label:l,status:s}}});
  db.collection('newusers').updateOne({email:e,password:p},{$push:{archive:t2}},function(err,r){
    if(err){console.log(err);}
  });
  db.collection('newusers').findOne({email:e,password:p},function(err,r){
    if(err){
      console.log(err);
    }else{
      console.log(r);
      res.render("usertasks",{name:n,em:e,pw:p,tasks:r.tasks});
    }
  });
});

app.post("/archive",function(req,res){
  var e=req.body.email;
  var p=req.body.pwd;
  var n=req.body.name;
  db.collection('newusers').findOne({email:e,password:p},function(err,r){
    if(err){
      console.log(err);
    }else{
      console.log(r);
      res.render("archive",{name:n,em:e,pw:p,arch:r.archive});
    }
  });
});

app.post("/archdel",function(req,res){
  var t=req.body.title;
  var t2=t.split("_").join(" ");
  var d=req.body.date;
  var l=(req.body.lab).split("_").join(" ");
  var s=(req.body.status).split("_").join(" ");
  var em=req.body.email;
  var pw=req.body.pwd;
  var name=req.body.name;
  db.collection('newusers').updateOne({email:em,password:pw},{$pull :{archive:{title:t2,ddate:d,label:l,status:s}}});
  db.collection('newusers').findOne({email:em,password:pw},function(err,r){
    if(err){
      console.log(err);
    }else{
      console.log(r);
      res.render("archive",{name:name,em:em,pw:pw,arch:r.archive});
    }
  });
})

app.post("/armove",function(req,res){
  var t=req.body.title;
  var t2=t.split("_").join(" ");
  var d=req.body.date;
  var l=(req.body.lab).split("_").join(" ");
  var s=(req.body.status).split("_").join(" ");
  var em=req.body.email;
  var pw=req.body.pwd;
  var name=req.body.name;
  var t3={title:t2,ddate:d,label:l,status:s};
  console.log(t2);
  db.collection('newusers').updateOne({email:em,password:pw},{$pull :{archive:{title:t2,ddate:d,label:l,status:s}}});
  db.collection('newusers').updateOne({email:em,password:pw},{$push:{tasks:t3}},function(err,r){
    if(err){console.log(err);}
  });
  db.collection('newusers').findOne({email:em,password:pw},function(err,r){
    if(err){
      console.log(err);
    }else{
      res.render("archive",{name:name,em:em,pw:pw,arch:r.archive});
    }
  });
})

app.post("/filtertask",function(req,res)
{
  var n=req.body.name;
  var e=req.body.email;
  var p=req.body.pwd;
  var d=req.body.ddate;
  db.collection('newusers').findOne({email:e,password:p},function(err,r){
    if(err){
      console.log(err);
    }else{
      var tasks=r.tasks;
      var tsk=[];
      tasks.forEach(function(task){
        if(task.ddate==d)
        {
          tsk.push(task);
        }
      });
    res.render("usertasks",{name:n,em:e,pw:p,tasks:tsk});
    }
  });
})

//LISTEN Request

app.listen( process.env.PORT || 3000,function(req,res){
  console.log("started");
});
