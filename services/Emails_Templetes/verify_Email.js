

async function veerify_Email_Body(data) {

    return `<p style="text-align: center;"><strong><span style="color: rgb(209, 72, 65);">latestlocaldealz.com.au</span></strong></p>
<p style='margin-top:0in;margin-right:0in;margin-bottom:8.0pt;margin-left:0in;line-height:107%;font-size:15px;font-family:"Calibri",sans-serif;text-align:center;'>Hi, `+ data.fname + `<br>&nbsp;welcome to Latestlocaldealz.com.au, you are just one step away from getting the best deals Small Australian Businesses have to offer. Please open that link in your browser for verification of your account.&nbsp;</p>
<p style='margin-top:0in;margin-right:0in;margin-bottom:8.0pt;margin-left:0in;line-height:107%;font-size:15px;font-family:"Calibri",sans-serif;text-align:center;'>Verification Link :&nbsp;</p>

<p style="text-align: center;"><strong><span style="color: rgb(209, 72, 65);">`+ data.uniquelink + `</span></strong></p>
`
}

module.exports.veerify_Email_Body = veerify_Email_Body;