let Parser = require('./bmi-parser')
let config = require('./config.json')
const fs = require('fs');
let parser = new Parser();
parser.parse(config.fileToParse).then((healthRecord)=>{
    fs.writeFile('evaluation_report.json', JSON.stringify(healthRecord, null, 4),(err) => {
        if (err) {  
            console.error(err);
              return; };
        console.log("Health record has been generated");
})
})




