import axios from 'axios'
import  express from  'express'
import  path  from 'path';
import  cors from 'cors'
import dotenv  from 'dotenv'
dotenv.config();
import auth from './auth.js'
import requireAuth from './auth-middleware.js'
import cookieParser from 'cookie-parser'
import { fileURLToPath } from 'url';

const __filename=fileURLToPath(import.meta.url);
const __dirname= path.dirname(__filename)

const app=express();

 app.use(cookieParser()); // ⭐ PEHLE 
app.use(express.json());

app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname,'public')));

app.all("/api/auth/*", async (req, res) => {
    // We manually construct the full URL to stop the "Invalid URL" crash
    const fullUrl = `${req.protocol}://${req.get("host")}${req.originalUrl}`;
    
    const authResponse = await auth.handler(new Request(fullUrl, {
        method: req.method,
        headers: new Headers(req.headers),
        body: ["POST", "PATCH", "PUT"].includes(req.method) 
            ? JSON.stringify(req.body) 
            : undefined,
    }));

    // Copy headers (for cookies/sessions)
    authResponse.headers.forEach((value, key) => {
        res.setHeader(key, value);
    });

    return res.status(authResponse.status).send(authResponse.body);
});

// const API_KEY='AIzaSykdV8g';
const API_KEY=process.env.YOUTUBE_API_KEY;  
const BASE_URL='https://www.googleapis.com/youtube/v3/search'
app.get('/',(req,res)=>{
    res.sendFile(path.join(__dirname,'public','index.html'));
})


app.get('/video',requireAuth,async(req,res)=>{
    const query= req.query.q;
    if(!query) return res.status(404).send("query not found");
    try{
        const response=await axios.get(BASE_URL,{
            params:{
            part:'snippet',
            q:query,
            type:'video',
            maxResults:20,
            key:API_KEY
        }
       })
    //    console.log("urls:",response.data.items);
       
const videos = response.data.items.map((video) => ({
    title: video.snippet.title,
    videoId: video.id.videoId,
    thumbnail: video.snippet.thumbnails.high ? video.snippet.thumbnails.high.url : video.snippet.thumbnails.medium.url 
}));
       console.log("vid",videos);
       
    //    res.send("fine Got it")
       res.json(videos)

    }catch(err){
        res.status(502).json({error:err.message})
    }

})

app.listen(3000, () => {
    console.log('Server is running at http://localhost:3000');
});






















// const express = require('express');
// const path = require('path');
// const axios = require('axios');
// const cors = require('cors');

// const app = express();
// const PORT = 3000;
// const BASE_URL = 'https://www.googleapis.com/youtube/v3/search';
// const API_KEY='AIzaSyBwYEhcrA-UDyD_sprTy8lreyJWHgkdV8g';

// app.use(express.json());
// app.use(cors());
// app.use(express.urlencoded({ extended: true }));
// app.use(express.static(path.join(__dirname, 'public')));

// app.get('/', (req, res) => {
//   res.sendFile(path.join(__dirname, 'public', 'index.html'));
// });

// app.get('/video', async (req, res) => {
//   const query = req.query.q;
//   if (!query) return res.status(400).send('Missing search query');

//   try {
//     const response = await axios.get(BASE_URL, {
//       params: {
//         part: 'snippet',
//         q: query,
//         type: 'video',
//         maxResults: 12,
//         key: API_KEY
//       }
//     });

//     const videos = response.data.items.map(item => ({
//       title: item.snippet.title,
//       videoId: item.id.videoId,
//       thumbnail: item.snippet.thumbnails.default.url
//     }));
//     // res.send("hello")
//     res.json(videos);
//   } catch (err) {
//     console.error('Error fetching videos:', err.message);
//     res.status(500).send('Error fetching videos');
//   }
// });

// app.listen(PORT, () => {
//   console.log(`Server is running at http://localhost:${PORT}`);
// });