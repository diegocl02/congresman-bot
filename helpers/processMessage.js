const API_AI_TOKEN = "34aa7e457a424efa8e8d239323720c14";
const apiAiClient = require("apiai")(API_AI_TOKEN);
const FACEBOOK_ACCESS_TOKEN = "EAAC65b8fEHUBAH5W8ZA0ii6vmARSTxv3VkNQcIX665DAVFUmpe9tDO5AfqqM8ZARFIOtDGRaUpfZCpbT1tOFbk9WESL7D5e80FcHGOpXlALCq705n8wYU3SglAnP24BN4Bk9vSFn7vFKZCOuI4kCvPNW9fSNMZC5dQ4Upeao7VAZDZD";
const request = require("request");

const sendMessage = (data) => {
  request(
    data,
    function(error, response, body) {
      if (error) {
        console.error('message failed: ', error);
      } else {
        console.log('message success: ', body);
      }
    }
  );
};

const sendTextMessage = (senderId, text) => {
  sendMessage({
    url: "https://graph.facebook.com/v2.6/me/messages",
    qs: { access_token: FACEBOOK_ACCESS_TOKEN },
    method: "POST",
    json: {
      recipient: { id: senderId },
      message: { text },
    }
  });
};

const sendButtons = (senderId, text, buttonTexts) => {
  sendMessage({
    url: "https://graph.facebook.com/v2.6/me/messages",
    qs: { access_token: FACEBOOK_ACCESS_TOKEN },
    method: "POST",
    json: {
      recipient: { id: senderId },
      message: {
        attachment: {
          type: "template",
          payload: {
            template_type: "button",
            text,
            buttons: buttonTexts
          },
        }
      }
    }
  });
};

module.exports = (event) => {
    const senderId = event.sender.id;
    const message = event.message.text;
    /*
    const apiaiSession = apiAiClient.textRequest(message, { sessionId: "congres_bot" });
    apiaiSession.on("response", (response) => {
        const result = response.result.fulfillment.speech;
        console.log('apiai got: ' + response.result.fulfillment.speech);
        sendTextMessage(senderId, result);
    });
    apiaiSession.on("error", error => console.log(error));
    apiaiSession.end();
    */
    // sendTextMessage(senderId, message + "2");
    const header = 'Actualmente se esta debatiendo el proyecto de ley "Ley que regula los hackathons". ¿Cómo deseas participar?';
    sendButtons(senderId, header, [
      {
        "type":"postback",
        "payload":"favor",
        "title":"Vota a favor"
      },
      {
        "type":"postback",
        "payload":"contra",
        "title":"Vota en contra"
      },
      {
        "type":"postback",
        "payload":"opinion",
        "title":"Danos tu opinion"
      }
    ]);
};
