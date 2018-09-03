"use strict";

const nodemailer = require("nodemailer");

var transport = null;
var settingUp = null;
async function getTransport() {
  if (transport != null) { return transport; }
  if (settingUp != null) { return await settingUp; }
  
  settingUp = new Promise(function(resolve) {
    nodemailer.createTestAccount((err, account) => {
      // create reusable transporter object using the default SMTP transport
      transport = nodemailer.createTransport({
        host: "smtp.ethereal.email",
        port: 587,
        secure: false, // true for 465, false for other ports
        auth: {
          user: account.user, // generated ethereal user
          pass: account.pass // generated ethereal password
        }
      });
      
      resolve(transport);
    });
  });
  
  return settingUp;
}

module.exports = {
  // opts: {to: string, subject: string, text: string, html: string}
  async send(opts) {
    let tp = await getTransport();
    
    opts.from = "\"LUFoodWatch\" <noreply@lufoodwatch.com>";
    
    await new Promise(function(resolve, reject) {
      tp.sendMail(opts, (error, info) => {
        if (error) {
          return reject(error);
        }
        console.log("Message sent: %s", info.messageId);
        
        // Preview only available when sending through an Ethereal account
        console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
        
        resolve();
      });
    });
  }
};