const StreamArray = require('stream-json/streamers/StreamArray');
const path = require('path');
const fs = require('fs');

const jsonStream = StreamArray.withParser();

module.exports = class BmiParser{

    async parse(fileName){
        let healthRecord = []
        return new Promise((resolve, reject) => {
            const filename = path.join(__dirname, fileName);
            if(!fs.existsSync(filename)){
                console.error('File doesnt exist')
                reject('Wrong file name');
                return;
            }
            fs.createReadStream(filename).pipe(jsonStream.input);
            jsonStream.on('data', ({key, value}) => {
                try{
               let bmi = this.calculateBmi(value.HeightCm, value.WeightKg);
                let evaluationResult = this.evaluateCategoryAndHealthRisk(bmi)
                value['Bmi'] = bmi;
                value['Category'] = evaluationResult.category
                value['Healthrisk'] = evaluationResult.healthRisk
                healthRecord.push(value)          
                }
                catch(ex){
                    console.error('error parsing for '+value, ex)
                }
            });
            jsonStream.on('end', () => {
            resolve(healthRecord)
         })
            jsonStream.on('error', (error) => {
               reject(errror)
            })
        });

      
    }

    
calculateBmi(heightInCm, weightinKg){
   return weightinKg/(heightInCm/100);
}

evaluateCategoryAndHealthRisk(bmi){
   let category, healthRisk;
   if(bmi <= 18.4){
       category = 'Underweight';
       healthRisk = 'Malnutrition risk'
   }
   else if(bmi >=18.5 && bmi<=24.9){
       category = 'Normal weight';
       healthRisk = 'Low risk'
   }
   else if(bmi >=25 && bmi<=29.9){
       category = 'Overweight';
       healthRisk = 'Enhanced risk'
   }
   else if(bmi >=30 && bmi<=34.9){
       category = 'Moderately obese';
       healthRisk = 'Medium risk'
   }
   else if(bmi >=35 && bmi<=39.9){
       category = 'Severely obese';
       healthRisk = 'High risk'
   }
   else if(bmi >=40){
       category = 'Very severely obese';
       healthRisk = 'Very high risk'
   }
   
   return {category, healthRisk}
}
}