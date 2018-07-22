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

const sendImage = (senderId, attachment_id) => {
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
            template_type: "media",
            elements: [{
              media_type: "image",
              attachment_id
            }]
          },
        }
      }
    }
  });
};

const waitingForOptinions = new Set();

module.exports = {
  processText(event) {
    const senderId = event.sender.id;
    if (waitingForOptinions.has(senderId)) {
      sendTextMessage(senderId, 'Gracias por tu opinión. Ésta estará disponible en la web y será enviada al congreso.');
      waitingForOptinions.delete(senderId);
      return;
    }
    const message = event.message.text;
    const header = 'Actualmente se esta debatiendo el proyecto de ley "Ley que regula los hackathons". ¿Cómo deseas participar?';
    sendButtons(senderId, header, [
      {
        "type":"postback",
        "payload":"votar",
        "title":"Votar"
      },
      {
        "type":"postback",
        "payload":"opinion",
        "title":"Danos tu opinión"
      },
      {
        "type":"postback",
        "payload":"estadisticas",
        "title":"Ver estadisticas"
      }
    ]);
  },
  processPostback(event) {
    const senderId = event.sender.id;
    const postback = event.postback.payload;
    if (postback == 'votar') {
      sendButtons(senderId, 'Tu voto importa', [
        {
          "type":"postback",
          "payload":"favor",
          "title":"A favor"
        },
        {
          "type":"postback",
          "payload":"contra",
          "title":"En contra"
        }
      ]);
    } else if (postback == 'favor') {
      sendTextMessage(senderId, 'Gracias por tu voto. El 40% de los votos también fueron a favor.');
    } else if (postback == 'contra') {
      sendTextMessage(senderId, 'Gracias por tu voto. El 60% de los votos también fueron en contra.');
    } else if (postback == 'opinion') {
      waitingForOptinions.add(senderId);
      sendTextMessage(senderId, 'Escribe tu opinión a continuacion:')
    } else if (postback == 'estadisticas') {
      // los url tienen que ser de facebook
      sendImage(senderId, '2055690994745115');
      sendImage(senderId, '2055692814744933');
    }

  }
};
