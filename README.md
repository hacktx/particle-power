Particle Power
==============

Control your wireless LED lighting system with the power of democracy and cute little emojis.

![Voting System](http://i.imgur.com/jr3Omni.png)

## Contributing

Have an idea for a little extra spice in our lighting system? A new animation, maybe? Check out our controller logic at [firmware/led-show.ino](firmware/led-show.ino).

Have a bug fix or an entirely new backend feature?! Check out the bot server at [src/bot.js](src/bot.js).

Submit a pull request or open up an issue, and we'll work with you to get it into our system <3

## Configuration

To configure this application to your slack, you'll need to :

* Create a new bot and token
* Create a new slash-command
* Configure your command to a publically-accessible URL hosting your server:
  * `http://{hostname}:{bot_port}/commands/{cmd_name}`
  * If you are running locally, [ngrok](https://ngrok.com) works like magic.
* Create your #ledparty channel
* Modify `config.js` accordingly

### Running the Server

1. `npm install`
2. `node index.js`