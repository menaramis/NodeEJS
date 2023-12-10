import express from "express";
import bodyParser from "body-parser";
import pg from "pg";

const strIoT = "What is IoT with simple example? \
The internet of things is a technology that allows us to add \
a device to an inert object (for example: vehicles, plant electronic systems, \
roofs, lighting, etc.) that can measure environmental \
parameters, generate associated data and transmit them through a communications network.";

const strIIoT = "Access to real-time data offers employees and executives the most accurate and \
up-to-date information to make data-driven decisions. For example, in manufacturing, IIoT applications include barcode scanners,\
 web cameras, signal lights, and sensors that measure temperature, humidity, and vibration."

const strHome = "Industry 4.0 refers to a new phase in the Industrial Revolution that \
focuses heavily on interconnectivity, automation, machine learning, and real-time data. Industry 4.0,\
 which encompasses IIoT and smart manufacturing, marries physical production and operations with \
 smart digital technology, machine learning, and big data to create a more holistic and better \
 connected ecosystem for companies that focus on manufacturing and supply chain management.\
  While every company and organization operating today is different, they all face a common \
  challenge—the need for connectedness and access to real-time insights across processes, partners, \
  products, and people."

const app = express();
const PORT = 3002;
const day = new Date().getFullYear();


// Creating DB Connection

const db = new pg.Client({
    user:"postgres",
    host:"localhost",
    database:"world",
    password:"admin",
    port:5433
})
db.connect();
var world_food=[]
db.query('select * from world_food', (req,res)=>{
    world_food = res.rows;
    console.log(world_food);

})

app.use(bodyParser.urlencoded({extended:true}))
app.set('view engine', 'ejs')

var posts = [{title:"IoT", body:strIoT},{title:"IIoT", body:strIIoT}]

app.get('/', (req,res)=>{
    res.render("pages/index.ejs", {data:strHome, year:day})

})

app.get('/world_food', (req,res)=>{
    res.render("pages/world_food", {data:world_food, year:day})

})

app.get('/world_food/:country', (req,res)=>{
    const topic = req.params.country;
    world_food.forEach(dt=>{
    if(dt.country === topic){
        res.render("pages/food.ejs", {year:day, data:dt})
       
    }
    })
    
    })

app.get('/articles', (req,res)=>{
    res.render("pages/articles.ejs", {data:posts, year:day})

})

app.get('/contact', (req,res)=>{
    res.render("pages/contact.ejs", {year:day})
   
})
app.get('/compose', (req,res)=>{
    res.render("pages/compose.ejs", {year:day})
   
})

app.get('/articles/:article', (req,res)=>{
const topic = req.params.article;
posts.forEach(post=>{
if(post.title === topic){
    res.render("pages/article.ejs", {year:day, data:post})
   
}
})

})

//deleting post // NOT FINISHED 
app.post('/delete/:article', (req,res)=>{
    const topic = req.params.article;
    posts.forEach(post=>{
    if(post.title === topic){
      const index = posts.findIndex(object=>{
return object.title === topic;
      });
      console.log(index);
      posts.splice(index,1);
        // res.render("pages/article.ejs", {year:day, data:post})
       
       
    }
    })
    res.redirect("/")
    })



app.post("/compose", (req,res)=>{
    const data = (req.body);
    posts.push(data);
    res.redirect('/')
    console.log(posts);
})

app.post("/contact", (req,res)=>{
    console.log(req.body);
})

app.listen(PORT, ()=>{
    console.log(`The server is running @ http://localhost:${PORT}`);
})