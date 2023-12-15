
var SibApiV3Sdk = require('sib-api-v3-sdk');
var defaultClient = SibApiV3Sdk.ApiClient.instance;
var apiKey = defaultClient.authentications['api-key'];
apiKey.apiKey = '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';
var apiInstance = new SibApiV3Sdk.EmailCampaignsApi();
var emailCampaigns = new SibApiV3Sdk.CreateEmailCampaign();
emailCampaigns.name = "Campaign sent via the API";
emailCampaigns.subject = "My subject";
emailCampaigns.sender = { "name": "From name", "email": "anshuman.kashyap@sendinblue.com" };
emailCampaigns.type = "classic";


apiInstance.createEmailCampaign(emailCampaigns).then(function (data) {
    console.log('API called successfully. Returned data: ' + data);
}, function (error) {
    console.error(error);
});