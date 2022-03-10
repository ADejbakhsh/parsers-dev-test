/*
interface Sample {
  arrivalAddress: string,
  arrivalTime: "string,
  currency: string,
  departureAddress: string,
  departureTime: string,
  distance: double,
  distanceFee: double,
  distanceUnit: string,
  duration: string,
  timeFee: double,
  totalPricePaid: double,
 */

const sample1 = require("./samples/sample_1").default;

function fromToo(html) {
  let trip_box = html.match(/<tr class="trip-box trip-details".*?<tr class="trip-box bottom"/gms)[0];

  const departureTimeRaw = trip_box.match(/<span\s*?class="from time".*?<\/tr>/ms)[0]
  const departureTime = departureTimeRaw.match(/(?<=>).*?(?=<\/span>)/ms)[0]

  const arrivalTimeRaw = trip_box.match(/<span\s*?class="to time".*?<\/tr>/ms)[0]
  const arrivalTime = arrivalTimeRaw.match(/(?<=>).*?(?=<\/span>)/ms)[0]

  const departureAddressRaw = departureTimeRaw.match(/(?<=<span\s*?class="address".*?>).*?(?=<\/span>)/ms)[0]
  const departureAddress = departureAddressRaw.replace(/\s+/g, ' ')

  const arrivalAddressRaw = arrivalTimeRaw.match(/(?<=<span\s*?class="address".*?>).*?(?=<\/span>)/ms)[0]
  const arrivalAddress = arrivalAddressRaw.replace(/\s+/g, ' ')

  return { departureTime, arrivalTime, departureAddress, arrivalAddress };
}


function detailBottomBox(html) {
  const detailBottomBox = html.match(/<tr class="trip-box bottom".*?<\/tr>/gms)[0]
  const tmp = detailBottomBox.match(/(?<=<td\sclass="trip-box-data".*?>).*?(?=>|<)/gs)
  
  let cleanArray = []
  
  tmp.forEach(e => {
    if (e.match(/[a-zA-Z0-9]/)) {
      cleanArray.push(e)
    }
  })

  return {
    distanceUnit: cleanArray[2],
    distance: cleanArray[3],
    duration: cleanArray[5],
  };
}


function parseSample(sample) {
  const html = sample?.html
  if (!html)
    return { error: "no sample given" };

  console.log(fromToo(html));
  console.log(detailBottomBox(html));
  




  return {};
}

parseSample(sample1);


exports.parseSample = parseSample;
