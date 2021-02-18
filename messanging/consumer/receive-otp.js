const ampq = require('amqplib/callback_api');
const fake_otp = require('./../../services/fake-otp');
const send_confirmation = require('./../producer/send-otp-sent-confirmation');

const RECEIVE_OTP_CONSUMER_TOPIC = "BE_OTP_SEND_TOPIC";

/**
 * @link https://github.com/rabbitmq/rabbitmq-tutorials/blob/master/javascript-nodejs/src/receive.js
 */
const consumer = ampq.connect(
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

        channel.assertQueue(
          RECEIVE_OTP_CONSUMER_TOPIC, {
            durable: true
          }
        );

        channel.consume(
          RECEIVE_OTP_CONSUMER_TOPIC, (msg) => {
            console.log("Received %s", msg.content.toString());

            obj = JSON.parse(msg.content.toString());

            console.log(obj);

            switch(process.env.OTP_TYPE){
              case "FAKE": 
                fake_otp(obj.phone, obj.otp_code)
                  .then(res => {
                    if(res.data.ok != undefined){
                      send_confirmation(obj.customer_id);
                    }
                  });


                break;

              default:
            }
          },{
            noAck: true
        });
      }
    );
});

module.exports = consumer;