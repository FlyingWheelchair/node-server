# node-server
Node server to query the NDC API.

## Getting Started

1. Install Node.js
1. Install yarn
1. run `yarn install`
1. run `node index.js`
1. visit http://localhost:3000

## Sample Requests

### AirShoppingRQ

```
POST /AirShoppingRQ
{
    "origin_code": "LHR",
    "destination_code": "BCN",
    "date": "2020-06-20"
}
```