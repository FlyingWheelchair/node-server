// content of index.js
const express = require('express');
const bodyParser = require('body-parser');
const request = require('request');
const json2xml = require('./xml/json2xml');
const xml2json = require('./xml/xml2json');
const port = 3000;

const xml = `<?xml version="1.0" encoding="UTF-8"?>
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
                <AgencyID>{{AGENCY_ID}}</AgencyID>
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
                    <IATA_LocationCode>LHR</IATA_LocationCode>
                </DestArrivalCriteria>
                <OriginDepCriteria>
                    <Date>2020-06-20</Date>
                    <IATA_LocationCode>BCN</IATA_LocationCode>
                </OriginDepCriteria>
            </OriginDestCriteria>
            <OriginDestCriteria>
                <DestArrivalCriteria>
                    <IATA_LocationCode>BCN</IATA_LocationCode>
                </DestArrivalCriteria>
                <OriginDepCriteria>
                    <Date>2020-06-27</Date>
                    <IATA_LocationCode>LHR</IATA_LocationCode>
                </OriginDepCriteria>
                <PreferredCabinType>
                    <CabinTypeCode>M</CabinTypeCode>
                </PreferredCabinType>
            </OriginDestCriteria>
        </FlightCriteria>
        <Paxs>
            <Pax>
                <PaxID>Pax1</PaxID>
                <PTC>ADT</PTC>
            </Pax>
            <Pax>
                <PaxID>Pax2</PaxID>
                <PTC>CHD</PTC>
            </Pax>
        </Paxs>
        <ShoppingCriteria>
            <CabinTypeCriteria>
                <CabinTypeCode>M</CabinTypeCode>
            </CabinTypeCriteria>
        </ShoppingCriteria>
    </Request>
</IATA_AirShoppingRQ>`;

const options = {
    url: 'https://iata.api.mashery.com/athena/ndc192api',
    headers: {
        'Content-Type': 'application/xml',
        'Authorization-Key': 'cfhjc5kthf44n23eft3qhum4',
    },
    body: xml,
};

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
server.post('/AirShoppingRQ', function(req, res) { 
    /*
    Expecting request body to look like:
    {
        "origin_code": "LHR",
        "destination_code": "BCN",
        "date": "2020-06-20",
        "pax_adt": 1,
        "pax_chd": 1
    }
    */
   console.log(req.body);
   request.post(options, xml, function (error, response, body) {
        parsedResponse = xml2json.parse(body);
        console.error('error:', error); // Print the error if one occurred
        console.log('statusCode:', response && response.statusCode); // Print the response status code if a response was received
        res.end(parsedResponse);
    });
});