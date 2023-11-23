const {XMLParser, XMLBuilder} = require("fast-xml-parser");
const fs = require("node:fs");
const http = require('http')
const port = 8000

var array = [];
const xml = fs.readFileSync("./data.xml", "utf-8");

const parser = new XMLParser();
let obj = parser.parse(xml);
const data = obj.indicators.banksincexp;
for(let i = 0; i < Object.keys(data).length; i++)
{
    if(data[i].txt === "Доходи, усього" || data[i].txt === "Витрати, усього")
    {
        const item = {  
              txt: data[i].txt,
              value: data[i].value,
          };
        array.push(item);
    }
}

const result = {
  data: {
    indicators: []
  }
}

array.forEach(element => {
  result.data.indicators.push(element);
})

const builder = new XMLBuilder({
    ignoreAttributes: false,
    format: true,
});
const output = builder.build(result)

const server = http.createServer(function(req, res) {
    res.writeHead(200, { 
      'Content-Type': 'application/xml; charset=utf-8' 
    });
  
    res.write(output);
    res.end();
  });

server.listen(port, function(error) {
    if(error)
    {
        console.log('Something went wrong', error)
    }
    else{
        console.log('Server is listening on port: ' + port)
    }
})