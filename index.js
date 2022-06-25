'use strict'
const express = require('express');
const fileUpload = require('express-fileupload');
const pdfparse = require('pdf-parse');
const app = express();
app.use("/",express.static("public"));
app.use(fileUpload());
// app.post('/upload', (req, res) => {
//     if (req.files === null) {
//       return res.status(400).json({ msg: 'No file uploaded' });
//     }
  
//     const file = req.files.file;
  
//     file.mv(`${__dirname}/client/public/uploads/${file.name}`, err => {
//       if (err) {
//         console.error(err);
//         return res.status(500).send(err);
//       }
  
//       res.json({ fileName: file.name, filePath: `/uploads/${file.name}` });
//     });
//   });
  
app.post("/extract-text",(req,res)=>
{
    if(!req.files && !req.files.pdfFile)
    {
        res.send("No file uploaded");
    }
    pdfparse(req.files.pdfFile).then(result=>
        {
            res.send(result.text);
            const jsondata = JSON.stringify(result.text);
            // console.log(jsondata);
            // extract date from pdf and display in console and send to frontend as json object to display in frontend as date picker except all format of date is dd-mm-yyyy so we need to convert it to this format
            const date = result.text.match(/\d{2}-\d{2}-\d{4}/g);

            const date1 = result.text.match(/\d{2}\/\d{2}\/\d{4}/g);

            console.log(date);
            // extract after date text from pdf and display in console and send to frontend as json object to display in frontend 
            const afterdate = result.text.match(/\d{2}\/\d{2}\/\d{4}\s[a-zA-Z]{10}.*/g);
            console.log(afterdate);

        });
}); 
app.listen(3000);