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

function arrayRemoveEmptyEntry(array) {
  return array.filter(e => e.match(/[a-zA-Z0-9]/));
}

// j'aurais pu toute les mettre mais comme on ne peut mettre que du code dans le main je fait cours
function currencyToAcronymen(currency) {
  switch (currency) {
    case "€":
      return "EUR";
    case "$":
      return "USD";
    case "£":
      return "GBP";
    case "¥":
      return "JPY";
    case "₽":
      return "RUB";
  }
}

// J'ai des doutes sur la façon dont cette fonction est faite
function formatUberInvoice(invoice) {
  invoice.distanceFee = parseFloat(invoice.distanceFee.replace(/,/g, '.'));
  invoice.timeFee = parseFloat(invoice.timeFee.replace(/,/g, '.'));
  invoice.totalPricePaid = parseFloat(invoice.totalPricePaid.replace(/,/g, '.'));
  invoice.distance = parseFloat(invoice.distance.replace(/,/g, '.'));

  if (invoice.departureTime.length <= 4)
    invoice.departureTime = `0${invoice.departureTime}`;

  if (invoice.arrivalTime.length <= 4)
    invoice.arrivalTime = `0${invoice.arrivalTime}`;
  
}


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


function fareDetails(html) {
  const fareDetails = html.match(/<table class="fare-details not-grid fare-breakdown".*?<\/table>/ms)[0]

  const tmp = fareDetails.match(/(?<=<td class="price".*?>).*?(?=>|<)/gms)

  const cleanArray = arrayRemoveEmptyEntry(tmp)

  // TODO: en cas de francs CHF
  const currency = currencyToAcronymen(cleanArray[6][0])

  const totalPricePaid = cleanArray[10].substring(1)

  return {
    distanceFee: cleanArray[2],
    timeFee: cleanArray[4],
    currency,
    totalPricePaid
  }
}


function parseSample(sample) {
  const html = sample?.html
  if (!html)
    return { error: "no sample given" };

  const midleBox = fromToo(html);
  const bottomBox = detailBottomBox(html);
  const fare = fareDetails(html);
  const response = { ...midleBox, ...bottomBox, ...fare };
  formatUberInvoice(response);
  
  return response;
}

parseSample(sample1);


exports.parseSample = parseSample;
