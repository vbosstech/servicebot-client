import {Client} from '../lib';

let client = new Client('midkiffks2@gmail.com', '12341234');
client.auth();
client.templates.list().then(function (r) {
    console.log("OUR RESPONSE: ", r.statusCode, r.body);
});

