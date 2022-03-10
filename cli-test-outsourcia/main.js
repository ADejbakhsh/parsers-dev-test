function arrayRemoveEmptyEntry(array) {
  return array.filter(e => e.match(/[a-zA-Z0-9]/));
}

function arrayRemoveExtraWhiteSpace(array) {
  let cleanArray = []
  array.forEach(element => {
    element = element.replace(/\s+|\|/g, ' ')
    cleanArray.push(element.replace(/^\s+|\s+$/g, ''))
  });
  return cleanArray
}

// j'aurais pu toute les mettre mais comme on ne peut mettre que du code dans le main je fait cours
function currencyToAcronymen(currency) {
  if (currency.match(/CHF/))
    return "CHF"
  if (currency.match(/\$/))
    return "USD"
  if (currency.match(/£/))
    return "GBP"
  if (currency.match(/€/))
    return "EUR"
}

// J'ai des doutes si cette fonction est propre
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
  const tripBox = html.match(/<tr class="trip-box trip-details".*?<tr class="trip-box bottom"/gms)[0];

  const departureTimeRaw = tripBox.match(/<span\s*?class="from time".*?<\/tr>/ms)[0]
  const departureTime = departureTimeRaw.match(/(?<=>).*?(?=<\/span>)/ms)[0]

  const arrivalTimeRaw = tripBox.match(/<span\s*?class="to time".*?<\/tr>/ms)[0]
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

  if (!tmp) {
    return {
      distance: "0",
      duration: "",
      distanceUnit: "",
    }
  }

  cleanArray = arrayRemoveEmptyEntry(tmp)

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

  const currency = currencyToAcronymen(cleanArray[cleanArray.length - 1])
  const totalPricePaid = cleanArray[cleanArray.length - 1].match(/[0-9]+\.{0,1}[0-9]{0,2}/sm)[0]


  //clairement pas la bonne façon de faire mais j'aurais le temps de finire en 5h sinons.
  let distanceFee = "0";
  let timeFee = "0";
  if (cleanArray.length === 14) {
    distanceFee = cleanArray[2];
    timeFee = cleanArray[4];
  }

  return {
    distanceFee,
    timeFee,
    currency,
    totalPricePaid
  }
}

function UberFranceInvoice(html) {
  const midleBox = fromToo(html);
  const bottomBox = detailBottomBox(html);
  const fare = fareDetails(html);
  const response = { ...midleBox, ...bottomBox, ...fare };
  formatUberInvoice(response);
  return response;
}


function fromTooSuisse(html) {
  const tripBox = html.match(/normalABlock.*?<\/table>/ms)[0];

  let tmp = tripBox.match(/(?<=<span\s*class="rideTime.*?>).*?(?=<|>)/gms)
  tmp = arrayRemoveEmptyEntry(tmp)

  let cleanArray = arrayRemoveExtraWhiteSpace(tmp)

  return {
    departureTime: cleanArray[0],
    arrivalTime: cleanArray[2],
    departureAddress: cleanArray[1],
    arrivalAddress: cleanArray[3],
  }
}

function detailBottomBoxSuisse(html) {
  const detailBottomBox = html.match(/(?<=<table.*?class="tripTable.*?>).*?(?=<!-- close Driver information -->)/ms)[0]

  const distanceUnitRaw = detailBottomBox.match(/(?<= class="tripInfoDescription.*?>).*?(?=<\/td>)/ms)[0]
  const distanceUnit = distanceUnitRaw.replace(/\s+/g, '')

  const distanceRaw = detailBottomBox.match(/(?<= class="tripInfo.*?>).*?(?=<\/td>)/ms)[0]
  const distance = distanceRaw.replace(/\s+/g, '')

  const duration = detailBottomBox.match(/[0-9]{2}:[0-9]{2}:[0-9]{2}/ms)[0]

  return {
    distanceUnit,
    distance,
    duration,
  }
}

function fareDetailsSuisse(html) {
  // scraper avec des commentaire me semble douteux
  const fareDetails = html.match(/(?<=<!-- put fare information in here -->).*?(?=<!-- end dropdown -->)/ms)[0]

  let tmp = fareDetails.match(/(?<=class="fareText.*?>).*?(?=<|>)/gms)
  tmp = arrayRemoveEmptyEntry(tmp)
  const cleanArray = arrayRemoveExtraWhiteSpace(tmp)

  const currency = currencyToAcronymen(cleanArray[cleanArray.length - 1])
  const totalPricePaid = cleanArray[cleanArray.length - 1].match(/[0-9]+,{0,1}[0-9]{0,2}/sm)[0]

  let distanceFee = "0";
  let timeFee = "0";
  if (cleanArray.length === 12) {
    distanceFee = cleanArray[3];
    timeFee = cleanArray[5];
  }

  return {
    distanceFee,
    timeFee,
    currency,
    totalPricePaid
  }
}

function UberSuisseInvoice(html) {
  const midleBox = fromTooSuisse(html);
  const bottomBox = detailBottomBoxSuisse(html);
  const fare = fareDetailsSuisse(html);
  const response = { ...midleBox, ...bottomBox, ...fare };
  formatUberInvoice(response);
  return response;
}

function parseSample(sample) {
  const html = sample?.html
  const from = sample?.headers?.from
  if (!html || !from) {
    return { error: "no sample given or invalide format" };
  }
  
  if (from.match(/receipt/))
    return UberFranceInvoice(html);
  // regex a revoir ⬇️
  if (from.match(/suisse/))
    return UberSuisseInvoice(html);

}


exports.parseSample = parseSample;
