const express=require('express')
const app = express()
const path=require('path')
const bodyParser=require('body-parser')

//connect mongodb
const {MongoClient}=require('mongodb')
const dotenv = require('dotenv');
const { urlencoded } = require('express');
dotenv.config();
//connect mongodb end



// MongoClient.connect(CONNECTIONSTRING , {useNewUrlParser:true} , async (err,client) => {
//     const db=client.db("blogData")
//     const result=await db.collection('blog').find({}).toArray()


//     console.log(result)
// })
app.use(express.static(path.join(__dirname,'public')))
app.set('view engine' , 'ejs')
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended:true}))

app.get('/' , (req , res) => {
    res.render("index")
})

app.get('/blog' , (req , res) => {
    MongoClient.connect(process.env.CONNECTIONSTRING , {useNewUrlParser:true} , async (err,client) => {
        const db=client.db("blogData")
        const result=await db.collection('blog').find({}).toArray()
        const total_blog=await db.collection('blog').count()
        res.render('blog' , {result , total_blog})
    })
  
})

app.get('/post' , (req ,res) => {
    res.render('post')
})


app.post('/post' , (req ,res) => {
    let title=req.body.title;
    let name=req.body.name;
    let id=req.body.id;
    let content=req.body.content;


    console.log(title , name , id  , content)
    const data={
        "title":title,
        "name":name,
        "id":id,
        "content":content
    }
    MongoClient.connect(process.env.CONNECTIONSTRING , {useNewUrlParser:true} , async (err,client) => {
        const db=client.db("blogData")
        await db.collection('blog').insertOne(data , (err , result) => {
            if(err) throw err

            console.log("a document added" , result)
        })
        // res.render('blog' , {result})
        res.send("Document inserted successfuly")
    })

})

const port = process.env.PORT|| 3000;
app.listen(port , () => {
    console.log(`App is listening on port ${port}...`)
})