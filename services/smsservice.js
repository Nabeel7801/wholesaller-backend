async function sendotp(myph, code) {
  var ph = '91' + myph;

  /// console.log(code);

  const axios = require('axios');

  var testedcode = '123456789';
  var url =
    'https://api.textlocal.in/send/?apikey=akrUIXWaqFE-Dzmso5T12G2gWQo8X6u99aSwFHz3Vf&numbers=' +
    ph +
    '&sender=WHOSLR&message=' +
    encodeURIComponent(
      //   'This is your one-time password ' + code + '- Prayash E-commerce'

      `This is your one-time password   ${code}   - Prayash E-commerce`
    );
  axios
    .get(url)
    .then(function (response) {
      console.log(response.data);
    })
    .catch(function (error) {
      console.log(error);
    });
}

module.exports.sendotp = sendotp;
