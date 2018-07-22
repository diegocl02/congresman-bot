const processMessage = require("../helpers/processMessage");
module.exports = (req, res) => {
    console.log("messageWebhook req", req, "messageWebhook rest", res)
    if (req.body.object === "page") {
        req.body.entry.forEach(entry => {
            entry.messaging.forEach(event => {
                if (event.message && event.message.text) {
                    processMessage(event);
                }
            });
        });
        res.status(200).end();
    }
};