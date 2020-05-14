const fs = require('fs');
const http = require('http');
const xml2js = require('xml2js');
const parser = new xml2js.Parser();
//const cron = require('node-cron');

const job = () => {
  const time = new Date();
  time.setHours ( time.getHours() + 2);
  let req = http.get("http://nextbike.net/maps/nextbike-official.xml", function(res) {
    let data = '';
    res.on('data', function(stream) {
      data += stream;
    });
    res.on('end', function(){
      parser.parseString(data, function(error, result) {
        if (error){
          console.log(error);
          return
        }

        let bikes = result.markers.country
            .find(c => c['$'].name == 'VRNnextbike').city
            .find(c => c['$'].name == 'Mannheim').place
            .find(p => p['$'].name == 'Universitätsklinik Mannheim - CampusRad')['$'].bikes;
        fs.appendFile('./data/nextBikeData.csv', `${time.toISOString()};${bikes};\n`, (err) =>{
          if(err){
            console.log(err);
            return;
          }
          console.log("SUCCESS");
        });
      });
    });
  });
}
job();
setInterval(job, 60*60*1000);

