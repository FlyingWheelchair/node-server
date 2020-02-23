var response = require('./example/AirShoppingRQResponse.json');

var result = []; //array to store necessary data

var i;
for(i=0;i<=29;i++){

var pax_segment=response['IATA_AirShoppingRS']['Response']['DataLists']['PaxSegmentList']['PaxSegment'][i];
var offer_item=response['IATA_AirShoppingRS']['Response']['OffersGroup']['CarrierOffers']['0']['Offer'][i]['OfferItem']['0'];
var offer=response['IATA_AirShoppingRS']['Response']['OffersGroup']['CarrierOffers']['0']['Offer'][i];
var information_i_want = {
    "shopping_response_ID": response['IATA_AirShoppingRS']['Response']['ShoppingResponse']['ShoppingResponseRefID']['_'],
    "flight_duration": pax_segment['Duration']['_'],
    "flight_number": pax_segment['MarketingCarrierInfo']['MarketingCarrierFlightNumberText']['_'],
    //"arrival_location": pax_segment['DatedOperatingLeg']['0']['Arrival']['StationName']['_'],
    "flight_destination": pax_segment['DatedOperatingLeg']['0']['Arrival']['IATA_LocationCode']['_'],
    "arrival_time":pax_segment['DatedOperatingLeg']['0']['Arrival']['AircraftScheduledDateTime']['_'],
    //"time-zone of arrival":pax_segment['DatedOperatingLeg']['0']['Arrival']['AircraftScheduledDateTime']['$']['TimeZoneCode'],

    "aircraft": pax_segment['DatedOperatingLeg']['0']['CarrierAircraftType']['CarrierAircraftTypeCode']['_'],

    "offer_item_id": offer_item['OfferItemID']['_'],
    "offer_id": offer['OfferID']['_'],
    "price": offer_item['Price']['TotalAmount']['_'],

    //"flight_origin": pax_segment['DatedOperatingLeg']['0']['Dep']['StationName']['_'],
    "departure_time": pax_segment['DatedOperatingLeg']['0']['Dep']['AircraftScheduledDateTime']['_'],
   "flight_origin": pax_segment['DatedOperatingLeg']['0']['Dep']['IATA_LocationCode']['_'],
    //"departure_time": pax_segment['DatedOperatingLeg']['0']['Dep']['AircraftScheduledDateTime']['$']['TimeZoneCode']
    };

result.push(information_i_want);
}
console.log(result);
//console.log("Shopping_response_id: "+response['IATA_AirShoppingRS']['Response']['ShoppingResponse']['ShoppingResponseRefID']['_']);












