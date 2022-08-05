const express = require("express");
const fs = require("fs");
const fileUpload = require("express-fileupload");
const pdfparse = require("pdf-parse");
const app = express();
app.use("/", express.static("public"));
app.use(fileUpload());

app.post("/extract-text", (req, res) => {
    try{
  if (req.files.pdfFile === null) {
    return res.status(400).send("No file uploaded");
  }
  const file = req.files.pdfFile;
  pdfparse(file).then(
    (result) => {
      
      // result.text send raw text
      fs.writeFileSync("public/text.txt", result.text);
      fs.readFile("public/text.txt", "utf8", (err, data) => {
        if (err) throw err;
        var lines = data.split("\n");
        let newText = "";
        let pay= "";
        
        for (var i = 0; i < lines.length; i++) 
        {
          if ((lines[i].match(/\d{1,2}-\d{1,2}-\d{4}/g) ||lines[i].match(/(Jan(uary)?|Feb(ruary)?|Mar(ch)?|Apr(il)?|May|Jun(e)?|Jul(y)?|Aug(ust)?|Sep(tember)?|Oct(ober)?|Nov(ember)?|Dec(ember)?),+(\d{1,2}),+(\d{4})/g)||lines[i].match(/\d{1,2}\/\d{1,2}\/\d{4}/g)))
          {
            newText += lines[i] + "\n";  
          } 
        }
        for(var j=0;j<lines.length;j++)
        {
            if(lines[j].match(/USD/g)||lines[j].match(/Rs/g)||lines[j].match(/paid/g)||lines[j].match(/recieved/g)||lines[j].match(/donated/g)||lines[j].match(/debited/g)||lines[j].match(/credited/g))
            {
                pay +=lines[j] + "\n";
            }
        }
        var startdate = "";
        var enddate = "";
        var milestone = "";
        var priority = "";
        var status = "";
        var assignee = "";
        var schema = "";
        var development = "";
        for (var k = 0;k<lines.length;k++)
        {
          var jsondata = JSON.parse(fs.readFileSync("category.json"));
          for(var l=0;l<9;l++)
          {
            if(lines[k].match(jsondata.startdate[l]))
            {
              startdate +=lines[k] + "\n";
            }
            else if (lines[k].match(jsondata.enddate[l])) {
              enddate +=lines[k] + "\n";
            }
            else if (lines[k].match(jsondata.milestone[l])) {
              milestone +=lines[k] + "\n";
            }
            else if (lines[k].match(jsondata.priority[l])) {
              priority +=lines[k] + "\n";
            }
            else if (lines[k].match(jsondata.status[l])) {
              status +=lines[k] + "\n";
            }
            else if (lines[k].match(jsondata.assignee[l])) {
              assignee +=lines[k] + "\n";
            }
            else if (lines[k].match(jsondata.schema[l])) {
              schema +=lines[k] + "\n";
            }
            else if (lines[k].match(jsondata.development[l])) {
              development +=lines[k] + "\n";
            }
          }
        }
        let category = "startdate \n"+startdate+"\nenddate \n"+enddate+"\nmilestone \n"+milestone+"\npriority \n"+priority+"\nstatus \n"+status+"\nassignee \n"+assignee+"\nschema"+schema+"\ndevelopment\n"+development;
        res.send("Date"+"\n"+newText+"\n"+"Payments"+"\n"+pay+"\n"+"Category"+"\n"+category);   
      });
    }
  );
}

catch{
    res.status(500).send("Not Found")
  }
});
app.listen(4000);
