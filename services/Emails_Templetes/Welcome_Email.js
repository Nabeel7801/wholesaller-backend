

async function welcome_Email_Body(data) {

    return `<p style='margin-top:0in;margin-right:0in;margin-bottom:8.0pt;margin-left:0in;line-height:107%;font-size:15px;font-family:"Calibri",sans-serif;text-align:center;'><strong><span style='font-size:19px;line-height:107%;font-family:"Calibri Light",sans-serif;color:#D50101;'>latestlocaldealz.com.au</span></strong></p>
    <p style='margin-top:0in;margin-right:0in;margin-bottom:8.0pt;margin-left:0in;line-height:107%;font-size:15px;font-family:"Calibri",sans-serif;text-align:center;'>Hi,`+ data.fname + `<br>&nbsp;welcome to the Latestlocaldealz family. With Latestlocaldealz, you will never miss a deal, you can easily find, shop, save and support Small Australian Businesses all in one place.&nbsp;</p>
    <p style='margin-top:0in;margin-right:0in;margin-bottom:8.0pt;margin-left:0in;line-height:107%;font-size:15px;font-family:"Calibri",sans-serif;text-align:center;'>Remember when you shop with us, you are supporting and keeping small business doors open.&nbsp;</p>
    <p style='margin-top:0in;margin-right:0in;margin-bottom:8.0pt;margin-left:0in;line-height:107%;font-size:15px;font-family:"Calibri",sans-serif;text-align:center;'>HAPPY SAVING&nbsp;</p>
    <p style='margin-top:0in;margin-right:0in;margin-bottom:8.0pt;margin-left:0in;line-height:107%;font-size:15px;font-family:"Calibri",sans-serif;text-align:center;'><a href="https://latestlocaldealz.com.au">https://latestlocaldealz.com.au</a></p>`

}

module.exports.welcome_Email_Body = welcome_Email_Body;