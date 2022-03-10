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
  let trip_box = html.match(/<tr class="trip-box trip-details".*?<tr class="trip-box bottom"/gms);
  
  const departureTimeRaw = trip_box[0].match(/<span\s*?class="from time".*?<\/tr>/ms)[0]
  const departureTime  = departureTimeRaw.match(/(?<=>).*?(?=<\/span>)/ms)[0]

  const arrivalTimeRaw = trip_box[0].match(/<span\s*?class="to time".*?<\/tr>/ms)[0]
  const arrivalTime  = arrivalTimeRaw.match(/(?<=>).*?(?=<\/span>)/ms)[0]

  const departureAddressRaw = departureTimeRaw.match(/(?<=<span\s*?class="address".*?>).*?(?=<\/span>)/ms)[0]
  const departureAddress  = departureAddressRaw.replace(/\s+/g, ' ')

  const arrivalAddressRaw = arrivalTimeRaw.match(/(?<=<span\s*?class="address".*?>).*?(?=<\/span>)/ms)[0]
  const arrivalAddress  = arrivalAddressRaw.replace(/\s+/g, ' ')

  return {departureTime, arrivalTime, departureAddress, arrivalAddress};
}


function parseSample(sample) {
  const html = sample?.html
  if (!html)
    return { error: "no sample given" };


  console.log(fromToo(html));




  return {};
}

parseSample(sample1);


exports.parseSample = parseSample;
