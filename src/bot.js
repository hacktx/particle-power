import Slack from "./slack.js";
import {
    bot_token,
    bot_port,
    valid_strip_names_message,
    vote_channel,
    vote_duration,
    vote_prompt,
    animations,
    strips,
} from "../config.js";

var api = new Slack(bot_token);
api.listenForCommands("/commands", bot_port);
api.startConnection();

function update_timer(strip_name, post, time_left) {
    api.slackApi("chat.update", {
        channel: post.channel,
        ts: post.ts,
        text: "Voting has started for *" + strip_name + "*. [" + time_left + "s]" + vote_prompt,
    });
}

function update_strip(strip_name, post) {
    strips[strip_name] = false;

    // Get most reactions
    api.slackApi("reactions.get", {
        channel: post.channel,
        timestamp: post.ts,
        full: true,
    }).then((res) => {
        var reactions = res.message.reactions;

        // Need to ignore emojis not in the original list

        var high = 0;
        for (var i = 0; i < reactions.length; i++) {
            if (reactions[i].count > reactions[high].count) high = i;
        }

        if (reactions[high].count == 1) {
            api.slackApi("chat.update", {
                channel: post.channel,
                ts: post.ts,
                text: "[:heart: ENDED] *" + strip_name + "* lives for another day.",
            });
            return;
        }

        var emoji = reactions[high].name;

        for (var animation in animations) {
            if (animations[animation] == emoji) {
                // Update post
                api.slackApi("chat.update", {
                    channel: post.channel,
                    ts: post.ts,
                    text: "[:" + emoji + ": ENDED] *" + strip_name + "* set to *" + animation + "*",
                });

                // Update Particle
                
            }
        }
    }).done();
}

function setIntervalX(callback, onEnd, delay, repetitions) {
    var x = 0;
    var intervalID = setInterval(function () {
       callback(x);
       if (++x === repetitions) {
           clearInterval(intervalID);
           onEnd();
       }
    }, delay);
}

api.on("command", function*(data, res) {
    if (!strips.hasOwnProperty(data.text)) {
        res.send(valid_strip_names_message);
        return;
    }

    var strip_name = data.text;
    if (strips[strip_name]) {
        res.send("*" + strip_name + "* is already being voted on.");
        return;
    }

    strips[strip_name] = true;

    // Post a message
    var post = yield api.slackApi("chat.postMessage", {
        channel: vote_channel,
        as_user: true,
        text: "Voting has started for *" + strip_name + "*." + vote_prompt,
    });

    // Add reactions for each animation
    for (var animation in animations) {
        yield api.slackApi("reactions.add", {
            channel: post.channel,
            timestamp: post.ts,
            name: animations[animation],
        });
    }

    var num_reps = vote_duration / 1000;

    setIntervalX(function(rep) {
        var time_left = num_reps - rep;
        update_timer(strip_name, post, time_left);
    }, function() {
        update_strip(strip_name, post);
    }, 1000, num_reps + 1);
});
