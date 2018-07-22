const processor = require("../helpers/processMessage");
module.exports = (req, res) => {
    console.log("messageWebhook req", req.body)
    if (req.body.object === "page") {
        req.body.entry.forEach(entry => {
          console.log('entry', entry);
            entry.messaging.forEach(event => {
                console.log('got event', event);
                if (event.message && event.message.text) {
                    console.log('got text: ', event.message.text);
                    processor.processText(event);
                } else if (event.postback) {
                    console.log('got postback: ', event.postback);
                    processor.processPostback(event);
                }
            });
        });
        res.status(200).end();
    }
};
