const { query } = require('express');
const express = require('express')
const path = require('path')
const PORT = process.env.PORT || 5000

const app = express()

const { Pool } = require('pg');
var pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: {
      rejectUnauthorized: false
    } 
    ||
    "postgres://postgres:@localhost/rectangle"
})
app.use(express.json())
app.use(express.urlencoded({extended:false}))
app.use(express.static(path.join(__dirname, 'public')))

app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'ejs')
app.get('/', (req, res) => res.render('pages/index'))

//below is to display main rectangle 
app.get('/database', async (req,res)=>{
  var getUsersQuery = `SELECT * FROM rec`;
  pool.query(getUsersQuery, async(error,result) => {
    if (error) {
        res.end(error)
    }
    else {
        var data = { rows : result.rows };
        res.render('pages/db', data);
      }
  })
})

//below function is to add new elements to database table
app.post('/addnewrow', async(req,res)=>{ 
  var getUsersQuery = `INSERT INTO rec(name,color,width,height) VALUES (
     '${req.body.uname}', '${req.body.color}'
     , ${req.body.width}, ${req.body.height})`;
    pool.query(getUsersQuery, async(error, result)=>{
      if(error) {
        res.end(error)
      }
      else{
       res.render('pages/insert_complete');
      }
    })
    //console.log(getUsersQuery);
})

//below is function to delete elements by its id
app.post('/deleterow', async(req,res)=>{
  var uid = req.body.id;
  var getUsersQuery = `DELETE FROM rec where uid = ${req.body.id}`;
  pool.query(getUsersQuery, async(error, result)=>{
    if(error) {
      res.end(error)
    }
    else{
     res.render('pages/delete_complete');
    }
  })
  //console.log(uid);
  //console.log(getUsersQuery);
})

//below is function to display user info
app.get('/userdb/:rid', (req,res)=>{
  //console.log("success");
  //console.log(req.params.rname);
  var getUsersQuery = `SELECT * FROM rec where uid = ${req.params.rid}`;
  pool.query(getUsersQuery, async(error,result) => {
    if (error) {
      res.end(error)
    }
    else {
      var data = { rows : result.rows };
      res.render('pages/user_db', data);
    }
  })
})
app.post('/updateName/:uid', (req,res)=>{
  var getUsersQuery = `UPDATE rec set name = '${req.body.uname}'
  where uid = ${req.params.uid}`;
  pool.query(getUsersQuery, async(error,result) =>{
    if(error){
      res.end(error)
    }
    else{
      res.render("pages/update_complete");
    }
  })
})
app.post('/updateColor/:uid', (req,res)=>{
  var getUsersQuery = `UPDATE rec set color = '${req.body.color}'
  where uid = '${req.params.uid}'`;
  pool.query(getUsersQuery, async(error,result) =>{
    if(error){
      res.end(error)
    }
    else{
      res.render("pages/update_complete");
    }
  })
})
app.post('/updateWidth/:uid', (req,res)=>{
  var getUsersQuery = `UPDATE rec set width = ${req.body.width}
  where uid = '${req.params.uid}'`;
  pool.query(getUsersQuery, async(error,result) =>{
    if(error){
      res.end(error)
    }
    else{
      var uid = {id:req.params.uid};
      res.render("pages/update_complete", uid);
    }
  })
})
app.post('/updateHeight/:uid', (req,res)=>{
  var getUsersQuery = `UPDATE rec set height = ${req.body.height}
  where uid = '${req.params.uid}'`;
  pool.query(getUsersQuery, async(error,result) =>{
    if(error){
      res.end(error)
    }
    else{
      res.render("pages/update_complete");
    }
  })
})
app.listen(PORT, () => console.log(`Listening on ${ PORT }`))

