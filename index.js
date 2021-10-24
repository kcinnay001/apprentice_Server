const express      = require('express')
const app          = express()
const mysql        = require('mysql');
const cookieParser = require('cookie-parser');
const session      = require('express-session');
const bodyParser   = require('body-parser');
const cors         = require('cors');
const e = require('express');
const PORT         = process.env.PORT || 4000;

require('dotenv').config();

const db = mysql.createConnection({
  host     : 'us-cdbr-east-04.cleardb.com',
  user     : 'b7ed56ad01faf9',
  password :  process.env.PASSWORD,
  database : 'sadb_records'
}); 

app.use(cors())
app.use(cookieParser());
app.use(express.json())
app.use(bodyParser.urlencoded({extended:true}))
app.use(session({
    key:'userId',
    secret:'subscribe',
    resave:false,
    saveUninitialized:false,
    cookie:{
        expires:60*60*24
    }
}))


//CONNECTING TO THE DB 
db.query('select 1',(err,val,fields)=>{
    if(err){
        console.log(err)
    }
    console.log('database connection: ' + db.state)
})

// GET ALL DATA 
app.get('/all',(req,res)=>{
    db.query('select * from mock_data',(err,val,fields)=>{
        if(err){
            console.log(err)
        }
        res.send(val)
    })

})

app.get('/',(req,res)=>{
    res.send('hello world')
})


// INSERT SOME DATA
app.post('/insert',(req,res)=>{

    // TEST VARIABLE FIELDS

    // const first_name = 'Yannick'
    // const last_name = 'Loembet'
    // const email = 'yannick@something.com'
    // const gender = 'male'
    // const street_address = '21 ballon rd'
   
    // ACTUAL VARIABLE FIELDS

    const first_name = req.body.first_name
    const last_name = req.body.last_name
    const email = req.body.email
    const gender = req.body.gender
    const street_address = req.body.street_address


    db.query(`insert into mock_data values (null,'${first_name}','${last_name}','${email}','${gender}','${street_address}')`,(err,val,fields)=>{
        if(err){
            console.log(err)
        } 
        res.send(val)
    })
})

//SELECT SINGLE USER
app.get('/user/:id',(req,res)=>{
    
    const id = req.params.id

    db.query(`select * from mock_data where id = ${id}`,(err,val)=>{
        if(err){
            console.log(err)
        }
        res.send(val)
    })
})

//UPDATE DATA 
app.put('/update',(req,res)=>{

    const userid = req.body.id
    const columnValue = req.body.columnValue
    const updatedValue = req.body.updatedValue

    db.query(`update mock_data set ${columnValue} = '${updatedValue}' where id = ${userid}`,(err,val)=>{
        if(err){
            console.log(err)
        } else {
            res.send(val)
        }
    })
})

//DELETE ENTRY 
app.delete('/delete/:id',(req,res)=>{

    const id = req.params.id
    db.query(`delete from mock_data where id = ${id}`)
})

// CONNECT TO THE PORT
app.listen(PORT,()=>{
    console.log(`PORT CONNECTED TO: ${PORT}`)
})