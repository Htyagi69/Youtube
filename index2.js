//Redis Based code which works on saving the tokens by checks the query done if it is same it do not fetch intstead serve previos data
const axios=require('axios')
const express= require('express');
const path =require('path');
const cors=require('cors')
const app=express();
const client=require('./client');
const { json } = require('stream/consumers');

app.use(express.json());
app.use(cors())
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname,'public')));

// const API_KEY='AIzaSykdV8g';
const API_KEY='AIzaSyBwYEhcrA-UDyD_sprTy8lreyJWHgkdV8g';
const BASE_URL='https://www.googleapis.com/youtube/v3/search'
app.get('/',(req,res)=>{
    res.sendFile(path.join(__dirname,'public','index.html'));
})

app.get('/video',async(req,res)=>{
    const query= req.query.q;
    if(!query) return res.status(404).send("query not found");
    try{
        const cached=await client.get(`video_${query}`)
        if(cached){
            console.log("cache hit");
            return res.json(JSON.parse(cached))
        }
        const response=await axios.get(BASE_URL,{
            params:{
            part:'snippet',
            q:query,
            type:'video',
            maxResults:10,
            key:API_KEY
        }
       })
    //    console.log("urls:",response.data.items);   

       const videos= await Promise.all(response.data.items.map(async(video)=>({
        title: video.snippet.title,
        videoId:video.id.videoId,
        thumbnail:video.snippet.thumbnails.default.url
       }
       ))
    )
    //   console.log('vid:',videos);
      await client.set(`video_${query}`,3600,JSON.stringify(videos))
     
    //    console.log("cache",cache);
       res.json(videos)
    // res.json(cache)
    //    res.json(videos)

    }
  catch (err) {
  console.error("YouTube API error:", err.response?.data || err.message);
  res.status(502).json({ error: "Failed to fetch videos" });
}

})

app.listen(3000, () => {
    console.log('Server is running at http://localhost:3000');
});


// const axios=require('axios')
// const express= require('express');
// const path =require('path');
// const cors=require('cors')
// const app=express();
// const client=require('./client')

// app.use(express.json());
// app.use(cors())
// app.use(express.urlencoded({ extended: true }));
// app.use(express.static(path.join(__dirname,'public')));

// // const API_KEY='AIzaSykdV8g';
// const API_KEY='AIzaSyBwYEhcrA-UDyD_sprTy8lreyJWHgkdV8g';
// const BASE_URL='https://www.googleapis.com/youtube/v3/search'
// app.get('/',(req,res)=>{
//     res.sendFile(path.join(__dirname,'public','index.html'));
// })

// app.get('/video',async(req,res)=>{
//     const query= req.query.q;
//     if(!query) return res.status(404).send("query not found");
//     try{
//         const response=await axios.get(BASE_URL,{
//             params:{
//             part:'snippet',
//             q:query,
//             type:'video',
//             maxResults:10,
//             key:API_KEY
//         }
//        })
//     //    console.log("urls:",response.data.items);   

//        const videos= await Promise.all(response.data.items.map(async(video)=>({
//         title: video.snippet.title,
//         videoId:video.id.videoId,
//         thumbnail:video.snippet.thumbnails.default.url
//        }
//        ))
//     )
//     //   console.log('vid:',videos);
//      await Promise.all(videos.map(async(video)=>(
//       await client.set(`video_${video.videoId}`,JSON.stringify(video))
//      ))
//     );
//      const cache=await Promise.all(videos.map(async(video)=>(
//       await client.get(`video_${video.videoId}`)
//      ))
//     )
//     const parsedCache = cache.map(item => JSON.parse(item));

     
//     //    console.log("cache",cache);
//        res.json(parsedCache)
//     // res.json(cache)
//     //    res.json(videos)

//     }
//     catch(err){
//         res.status(502).json({error:err.message})
//     }

// })

// app.listen(3000, () => {
//     console.log('Server is running at http://localhost:3000');
// });






















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