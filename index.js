// content of index.js
const express = require('express');
const bodyParser = require('body-parser');
const request = require('request');
const json2xml = require('./xml/json2xml');
const xml2json = require('./xml/xml2json');
const port = 3000;

const server = express();
server.use(bodyParser.json());

server.listen(port, (err) => {
    if (err) {
        return console.log('something bad happened', err);
    }
    console.log(`server is listening on ${port}`);
})

server.get('/', function(req, res) {  res.end('Hello World!');});
server.get('/about', function(req, res) {  res.end('About!');});

const NDC_API_URL = 'https://iata.api.mashery.com/athena/ndc192api';
const HEADERS = {
    'Content-Type': 'application/xml',
    'Authorization-Key': 'cfhjc5kthf44n23eft3qhum4',
};

server.post('/AirShoppingRQ', function(req, res) { 
    /*
    Expecting request body to look like:
    {
        "origin_code": "LHR",
        "destination_code": "BCN",
        "date": "2020-06-20"
    }
    */
    data = req.body;
    const options = {
        url: NDC_API_URL,
        headers: HEADERS,
        body: generateNdcAirShoppingXmlRequest(data),
    };
    request.post(options, function (error, response, body) {
        parsedResponse = xml2json.parse(body);
        console.error('error:', error); // Print the error if one occurred
        console.log('statusCode:', response && response.statusCode); // Print the response status code if a response was received
        res.end(parsedResponse);
    });
});

function generateNdcAirShoppingXmlRequest(data) {
    return `<?xml version="1.0" encoding="UTF-8"?>
    <IATA_AirShoppingRQ xmlns="http://www.iata.org/IATA/2015/00/2019.2/IATA_AirShoppingRQ">
        <MessageDoc>
            <RefVersionNumber>1.0</RefVersionNumber>
        </MessageDoc>
        <Party>
            <Participant>
                <Aggregator>
                    <AggregatorID>88888888</AggregatorID>
                    <Name>JR TECHNOLOGIES</Name>
                </Aggregator>
            </Participant>
            <Sender>
                <TravelAgency>
                    <AgencyID>9A</AgencyID>
                    <IATA_Number>12312312</IATA_Number>
                    <Name>Gods Travel</Name>
                </TravelAgency>
            </Sender>
        </Party>
        <PayloadAttributes>
            <EchoTokenText>{{$guid}}</EchoTokenText>
            <Timestamp>2001-12-17T09:30:47+05:00</Timestamp>
            <TrxID>transaction{{$randomInt}}</TrxID>
            <VersionNumber>2019.2</VersionNumber>
        </PayloadAttributes>
        <POS>
            <City>
                <IATA_LocationCode>ATH</IATA_LocationCode>
            </City>
            <Country>
                <CountryCode>GR</CountryCode>
            </Country>
            <RequestTime>2018-10-12T07:38:00</RequestTime>
        </POS>
        <Request>
            <FlightCriteria>
                <OriginDestCriteria>
                    <DestArrivalCriteria>
                        <IATA_LocationCode>${data.destination_code}</IATA_LocationCode>
                    </DestArrivalCriteria>
                    <OriginDepCriteria>
                        <Date>${data.date}</Date>
                        <IATA_LocationCode>${data.origin_code}</IATA_LocationCode>
                    </OriginDepCriteria>
                </OriginDestCriteria>
            </FlightCriteria>
            <Paxs>
                <Pax>
                    <PaxID>Pax1</PaxID>
                    <PTC>ADT</PTC>
                </Pax>
            </Paxs>
            <ShoppingCriteria>
                <CabinTypeCriteria>
                    <CabinTypeCode>M</CabinTypeCode>
                </CabinTypeCriteria>
            </ShoppingCriteria>
        </Request>
    </IATA_AirShoppingRQ>`;
}

server.post('/OfferPriceRQ', function(req, res) { 
    /*
    Expecting request body to look like:
    {
        "offer_ref_id": "OFFER1",
        "offer_item_ref_id": "OFFERITEM1_1",
        "shopping_response_ref_id": "201-2854d1876cd343c9aa78bb60b2afd4a",
        "special_service_code": "WCHS",
        "pax_list": [
            {
                "given_name": "John",
                "surname": "Smiths",
                "title_name": "Mr",
                "ptc": "ADT"
            }
        ]
    }
    */
    data = req.body;
    const options = {
        url: NDC_API_URL,
        headers: HEADERS,
        body: generateNdcOfferPriceXmlRequest(data),
    };
    request.post(options, function (error, response, body) {
        parsedResponse = xml2json.parse(body);
        console.error('error:', error); // Print the error if one occurred
        console.log('statusCode:', response && response.statusCode); // Print the response status code if a response was received
        res.end(parsedResponse);
    });
});

function generateNdcOfferPriceXmlRequest(data) {
    return `<?xml version="1.0" encoding="UTF-8"?>
    <IATA_OfferPriceRQ xmlns="http://www.iata.org/IATA/2015/00/2019.2/IATA_OfferPriceRQ">
        <MessageDoc>
                <RefVersionNumber>1.0</RefVersionNumber>
        </MessageDoc>
        <Party>
            <Participant>
                <Aggregator>
                    <AggregatorID>88888888</AggregatorID>
                    <Name>JR TECHNOLOGIES</Name>
                </Aggregator>
            </Participant>
            <Sender>
                <TravelAgency>
                    <AgencyID>9A</AgencyID>
                    <IATA_Number>12312312</IATA_Number>
                    <Name>Gods Travel</Name>
                </TravelAgency>
            </Sender>
        </Party>
        <POS>
            <City>
                <IATA_LocationCode>ATH</IATA_LocationCode>
            </City>
            <Country>
                <CountryCode>GR</CountryCode>
            </Country>
            <RequestTime>2018-10-12T07:38:00</RequestTime>
        </POS>
        <Request>
            <DataLists>
                <PaxList>
                    <Pax>
                        <Individual>
                            <GivenName>${data.pax_list[0].given_name}</GivenName>
                            <Surname>${data.pax_list[0].surname}</Surname>
                            <TitleName>${data.pax_list[0].title_name}</TitleName>
                        </Individual>
                        <LoyaltyProgramAccount>
                            <AccountNumber>1234525525</AccountNumber>
                        </LoyaltyProgramAccount>
                        <PaxID>Pax1</PaxID>
                        <PTC>${data.pax_list[0].ptc}</PTC>
                    </Pax>
                </PaxList>
            </DataLists>
            <PricedOffer>
                <SelectedOffer>
                    <OfferRefID>${data.offer_ref_id}</OfferRefID>
                    <OwnerCode>9A</OwnerCode>
                    <SelectedOfferItem>
                        <OfferItemRefID>${data.offer_item_ref_id}</OfferItemRefID>
                        <PaxRefID>Pax1</PaxRefID>
                    </SelectedOfferItem>
                    <ShoppingResponseRefID>${data.shopping_response_ref_id}</ShoppingResponseRefID>
                </SelectedOffer>
            </PricedOffer>
             <ShoppingCriteria>
                 <CabinTypeCriteria>
                     <CabinTypeCode>M</CabinTypeCode>
                 </CabinTypeCriteria>
                 <SpecialNeedsCriteria>
                    <SpecialServiceCode>${data.special_service_code}</SpecialServiceCode>
                 </SpecialNeedsCriteria>
             </ShoppingCriteria>		
        </Request>
    </IATA_OfferPriceRQ>`;
}