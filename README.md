Particle Power
==============

Slack plays LED lights.

![Voting System](http://i.imgur.com/VKRocBB.png)

## Configuration

To configure this application to your slack, you'll need to :

* Create a new bot and token
* Create a new slash-command
* Configure your command to a publically-accessible URL hosting your server:
  * `http://{hostname}:{bot_port}/commands/{cmd_name}`
* Create your #ledparty channel
* Modify `config.js` accordingly

### Running the Server

1. `npm install`
2. `node index.js`