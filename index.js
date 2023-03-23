const { Client } = require("whatsapp-web.js");
const qrcode = require("qrcode-terminal");
const { Configuration, OpenAIApi } = require("openai");
require("dotenv").config();

const client = new Client();

client.on('qr', (qr) => {
    qrcode.generate(qr, { small: true });
});

client.on('ready', () => {
    console.log("Client is ready");
});

client.initialize();

const configuration = new Configuration({
    apiKey: process.env.SECRET_KEY,
});
const openai = new OpenAIApi(configuration);

async function runCompletion(message) {
    const completion = await openai.createCompletion({
        model: "text-davinci-003",
        prompt: message,
        max_tokens: 1000,
    });
    return completion.data.choices[0].text;
}

client.on('message', message => {
    console.log(message.body);
    if (message.body.toLocaleLowerCase() == "who created you"){
        message.reply("virendra nawkar");
    }
    runCompletion(message.body).then(result => {
        console.log(result); if (result.length == 0) {
            console.log("result length is zero sending dummy message"); message.reply("nothing found"); return;
        } message.reply(result);
        return;
    });
})