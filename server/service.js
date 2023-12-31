import Replicate from "replicate";
import express from 'express';
import multer from 'multer';
import * as fsPromises from 'fs/promises';

// const express = require('express');
const app = express();
app.use(express.json());       // to support JSON-encoded bodies

app.all('*',function(req,res,next){
    res.header('Access-Control-Allow-Origin','*');
    res.header('Access-Control-Allow-Headers','Content-Type, token');
    res.header('Access-Control-Allow-Methods','*');
    res.header('Content-Type','application/json;charset=utf-8');
    next();
})

const replicateToken = process.env.REPLICATE_API_TOKEN;

if (!process.env.hasOwnProperty('REPLICATE_API_TOKEN')) {
  throw new Error('REPLICATE_API_TOKEN is not set');
}

const replicate = new Replicate({ auth: replicateToken }); 

var storage = multer.memoryStorage()
var upload = multer({ storage: storage,limits: { fileSize: 1024*1024 }})

app.post('/api/upload', upload.single('file'),function(req, res) {  
    const fileSize = parseInt(req.headers["content-length"])
    console.log("file size:"+fileSize)  
    const body = req.file; 
    const base64Data = body.buffer.toString("base64");

    const model = "cjwbw/seamless_communication:668a4fec05a887143e5fe8d45df25ec4c794dd43169b9a11562309b2d45873b0";
    const input = {
        task_name: "S2ST (Speech to Speech translation)",
        // TBC: REPLACE 
        input_audio: 'data:audio/wav;base64,' + base64Data,
        input_text_language: "None",
        max_input_audio_length: 60,
        target_language_text_only: req.body.lang,
        target_language_with_speech: req.body.lang
      };
    replicate.run(model, { input }).then((data)=>{
        console.log(data);
        res.json({ url: data.audio_output,text: data.text_output });
    });

});

app.post('/api/service', function(req, res) {
    console.log(req.body);
    res.json({ name: "hello from mock server:" + req.body.lang });
});

app.post('/api/langoptions', function(req, res) {
    console.log("langOptions request");
    res.json([
        { code: "1", name: "Mandarin Chinese" },
        { code: "2", name: "English" },
        { code: "3", name: "French" },
        { code: "4", name: "Japanese" }
    ]);
});

const server = app.listen(8804,function(){
    console.log("server listening on port %d",server.address().port);
})
