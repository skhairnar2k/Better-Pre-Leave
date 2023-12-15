const axios = require('axios');
const formData = require('form-data');
const Mailgun = require('mailgun.js');

const DOMAIN = 'sandbox813518b3104448358ca3027eead3ef8b.mailgun.org';
const API_KEY = 'a0be8df97a47632e3b0c61214ea25487-2cc48b29-83a4ac7d';
const MAILGUN_URL = `https://api.mailgun.net/v3/${DOMAIN}/messages`;

const mailgun = new Mailgun(formData);
const mg = mailgun.client({ username: 'api', key: 'key-a0be8df97a47632e3b0c61214ea25487-2cc48b29-83a4ac7d' });




mg.messages.create('sandbox-123.mailgun.org', {
    from: "Excited User <mailgun@sandbox-123.mailgun.org>",
    to: ["ashishofficially@gmail.com"],
    subject: "Hello",
    text: "Testing some Mailgun awesomeness!",
    html: "<h1>Testing some Mailgun awesomeness!</h1>"
})
    .then(msg => console.log(msg)) // logs response data
    .catch(err => console.log(err)); // logs any error
