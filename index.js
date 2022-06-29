"use strict";
const express = require("express");
const fs = require("fs");
const fileUpload = require("express-fileupload");
const pdfparse = require("pdf-parse");
const app = express();
app.use("/", express.static("public"));
app.use(fileUpload());
app.post("/extract-text", (req, res) => {
  if (req.files.pdfFile === null) {
    return res.status(400).send("No file uploaded");
  }
  const file = req.files.pdfFile;
  pdfparse(file).then(
    (result) => {
      res.send(result.text);
      // result.text send raw text
      fs.writeFileSync("public/text.txt", result.text);
      fs.readFile("public/text.txt", "utf8", (err, data) => {
        if (err) throw err;
        var lines = data.split("\n");
        let newText = "";
        for (var i = 0; i < lines.length; i++) 
        {
          if ((lines[i].match(/\d{2}-\d{2}-\d{4}/g) ||lines[i].match(/\d{2}\/\d{2}\/\d{4}/g))||(lines[i].match(/\d{2}-\d{1}-\d{4}/g)||lines[i].match(/\d{2}\/\d{1}\/\d{4}/g)))
          {
            newText += lines[i] + "\n";  
          } 
        }
        fs.appendFileSync("public/text.txt", newText);
            console.log(newText); 
      }); //.then()     //delete file
    }
  );
});
app.listen(4000);
// result.text.match(/\d{2}\/\d{2}\/\d{4}.*/g)
