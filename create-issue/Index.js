var axios = require('axios');
var moment = require('moment');
  
var token = process.env.token;
var endpoint = 'https://api.github.com/repos/kittychengyuenpui/lambda-check-in-test/issues?access_token=' + token;
var today = moment().utcOffset('+0800').format('YYYY-MM-DD');
  
var content = [
  'Check-in format:',
  '```',
  'check-in',
  'your name',
  '```'
].join('\n');
  
const createIssue = async (event) => {
    const result=await axios({
      url: endpoint,
      method: "post",
      data: {
        title: '[Auto-check-in] ' + today,
        body: content
      },
      mode: 'no-cors',
      withCredentials: true,
      headers: {'Accept': 'application/vnd.github.v3+json', 'Content-Type': 'application/json', 'Authorization': 'token ' + token }
    }).then(function (response) {
     return {
            statusCode: response.status,
            body: JSON.stringify(response.data)
        };
  }).catch(function (err)  {
    return {
            statusCode: err.response.status,
            body: JSON.stringify(err.message)
        };
  });
};

exports.handler = createIssue; 



