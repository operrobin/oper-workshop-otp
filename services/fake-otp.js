const axios = require('axios');

/**
 * fake-otp.js
 * This file used for triggering fake-otp on local environment.
 * Currently the service is set to Telegram.
 * For more information, please refer to this link.
 * 
 * @link https://core.telegram.org/bots/api
 */

const send_otp = async (phone, generated_otp) => {
  try{
    return await axios.post(
      process.env.TELEGRAM_API_URI + process.env.TELEGRAM_API_KEY + "/sendMessage",
      {
        "chat_id": process.env.TELEGRAM_CHAT_ID,
        "text": `If you receive this message then the Message Broker is working. This OTP Code is for number ${phone} : ${generated_otp}`
      }
    );
  }catch (e){
    console.log(e);
  }
}

module.exports = send_otp;