//jshint esversion:6

import express from "express";
import bodyParser from "body-parser";
import _ from "lodash";
import mongoose from "mongoose";

mongoose.connect('mongodb+srv://vedantgore:csk%401331@cluster0.jgucr4y.mongodb.net/?retryWrites=true&w=majority');

const postSchema=mongoose.Schema({
  title:String,
  post:String
})

const Posts=mongoose.model("post",postSchema);

const homeStartingContent = "Welcome to our Daily Journal website, your digital haven for capturing the essence of each day's journey. In a world that moves at an unrelenting pace, it's essential to pause and reflect on the moments that shape our lives. Our platform provides you with a simple yet powerful tool to chronicle your thoughts, experiences, and emotions, ensuring that no memory fades into the background. Whether you're embarking on a new adventure, overcoming challenges, or simply savoring the beauty of the ordinary, our Daily Journal is here to be your faithful companion.Join us in the art of mindful introspection as we embark on a voyage of self-discovery, one entry at a time. Your story matters, and this is the canvas on which it unfolds. Start your journey with us today."
const aboutContent = "Our journey began with a simple idea: to provide a space where individuals from all walks of life could capture their thoughts, experiences, and emotions in a meaningful way. Founded by a team of passionate journaling enthusiasts, our mission is to empower you to embrace introspection as a daily ritual.We believe that every moment, no matter how seemingly ordinary, carries a unique significance. Our platform is designed to help you pause, connect, and document your journey through life, one entry at a time. From the highs to the lows, from achievements to lessons learned, our Daily Journal is your canvas for self-discovery.";
const contactContent = "We're thrilled that you're interested in connecting with us! Your feedback, questions, and insights are incredibly important to us. Whether you have a suggestion to improve your journaling experience, need assistance with a feature, or simply want to share your thoughts, we're here to listen and engage.Feel free to reach out to us through the following channels:Customer Support:Our dedicated support team is ready to assist you with any inquiries you may have. If you need help navigating the website, using features, or troubleshooting any issues, please don't hesitate to contact us at support@email.com or call our toll-free number: 1-800-JOURNAL.";

const app = express();
var array= await Posts.find({}).exec();
app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

app.get("/", async(req, res) => {
  array= await Posts.find({}).exec();
  res.render("home.ejs", { array: array, data: homeStartingContent });
})

app.get("/about", (req, res) => {
  res.render("about.ejs", { data: aboutContent });
})

app.get("/contact", (req, res) => {
  res.render("contact.ejs", { data: contactContent });
})

app.get("/home", async(req, res) => {
  res.render("home.ejs", { data: homeStartingContent, array:array});
})

app.get("/compose", (req, res) => {
  res.render("compose.ejs");
})

app.post("/compose", async(req, res) => {

  const post1 = new Posts({
    title: req.body.composeTitle,
    post: req.body.composePost
  })

  await post1.save();

  array=await Posts.find({}).exec();
  res.redirect("/");
})

app.get(`/posts/:titlee`, async(req, res) => {
  const id=req.params.titlee;
    const post1=await Posts.findOne({_id:id}).exec();
    res.render("post.ejs",{title:post1.title,post:post1.post});
})

app.post("/delete",async(req,res)=>{
  const id=req.body.id;
  await Posts.findByIdAndDelete(id).exec();
  res.redirect("/");
})

app.listen(3000, function () {
  console.log("Server started on port 3000");
});
