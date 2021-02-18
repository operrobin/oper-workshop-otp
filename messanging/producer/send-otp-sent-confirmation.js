const ampq = require('amqplib/callback_api');

const SEND_CONFIRMATION_PRODUCER_TOPIC = "BE_OTP_CONFIRMATION_TOPIC";

const producer = (otp_id) => {
  
  ampq.connect(
    process.env.RABBIT_MQ_SERVER_URI,
    (err, connection) => {
      if(err){
        throw err;
      }
      
      connection.createChannel(
        (err, channel) => {
          if(err){
            throw err;
          }
          
          var message = `{"otp_id": ${otp_id}}`;
 
          channel.assertQueue(SEND_CONFIRMATION_PRODUCER_TOPIC, {
            durable: true
          });

          channel.sendToQueue(
            SEND_CONFIRMATION_PRODUCER_TOPIC,
            Buffer.from(message)
          );

          console.log("Sent %s", message);
        }
      );
      
      setTimeout(function() {
        connection.close();
      }, 500);
    }
  );
}

module.exports = producer;