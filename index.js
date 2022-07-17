const express = require("express");
const body_parser = require("body-parser");
const { default: axios } = require("axios");
require("dotenv").config();

const app = express().use(body_parser.json());

const token = process.env.TOKEN;
const myToken = process.env.MYTOKEN;

app.listen(8000 || process.env.PORT, () => {
  console.log("WebHook is listening");
});

// you well take full url. from huroki.
app.get("/webhook", (req, res) => {
  let mode = req.query["hub.mode"];
  let challenge = req.query["hub.challenge"];
  let token = req.query["hub.verify_token"];

  if (mode && token) {
    if (mode === "subscribe" && token === myToken) {
      res.status(200).send(challenge);
    } else {
      res.status(403);
    }
  }
});

app.post("/webhook", (req, res) => {
  let body_param = req.body;
  console.log(JSON.stringify(body_param, null, 2));

  if (body_param.object) {
    if (
      body_param.entry &&
      body_param.entry[0].changes &&
      body_param.entry[0].changes[0].value.message &&
      body_param.entry[0].changes[0].value.message[0]
    ) {
      let phone_no_id =
        body_param.entry[0].changes[0].value.metadata.phone_number_id;
      let form = body_param.entry[0].changes[0].value.message;
      let msg_body = body_param.entry[0].changes[0].value.message[0].text.body;

      axios({
        method: "POST",
        url:
          "https://graph.facebook.com/v13.0/" +
          phone_no_id +
          "/messages?access_token=" +
          token,
        data: {
          messaging_product: "whatsapp",
          to: form,
          text: {
            body: "hi.., Iam Ahmed!",
          },
        },
        headers: {
          "Content-Type": "application/json",
        },
      });

      res.sendStatus(200);
    } else {
      res.sendStatus(404);
    }
  }
});
