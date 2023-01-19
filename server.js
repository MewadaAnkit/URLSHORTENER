require('dotenv').config();
const express = require('express');
const { default: mongoose } = require('mongoose');
const shortid = require('shortid');
const ValidUrl = require('valid-url')
const app = express();
const Port = process.env.PORT || 3000
const ShortUrl = require('./models/shortUrls')

app.use(express.urlencoded({extended:false}))

mongoose.connect(process.env.DB ,{
    useNewUrlParser:true,
    useUnifiedTopology:true,
}).then(()=>{

    console.log("Successfully connected to Database");

}).catch((err)=>console.log(err));

app.set('view engine' , 'ejs')
//app.set('views','views')

app.get('/', async(req,res)=>{
 const shortURLS = await ShortUrl.find()
    res.render('index', {shortURLS:shortURLS})
})
app.post("/shortUrls",async (req,res)=>{
  
  await ShortUrl.create({full:req.body.fullurl});

  res.redirect('/')
  
})

app.get('/:shortUrl', async (req,res)=>{
  const SHORT_url = await ShortUrl.findOne({ short : req.params.shortUrl})
  if(SHORT_url == null){
     return res.status(404);
  }
  SHORT_url.clicks++
  SHORT_url.save();
  res.redirect(SHORT_url.full);
})

app.listen(Port  , ()=>{
    console.log("Sever started listening at port 3000")
})