import Slack from "./slack.js";

import {
    bot_port,
    bot_token,
    vote_channel,
    vote_duration,
} from "../config.js";

import {
    animations,
    available_strips_message,
    strips,
    vote_prompt,
} from "../led_config.js";

var api = new Slack(bot_token);
api.listenForCommands("/commands", bot_port);
api.startConnection();

api.on("command", function*(data, res) {

    // Check whether the requested strip exists.
    if (!strips.hasOwnProperty(data.text)) {
        res.send(available_strips_message);
        return;
    }

    // Check whether a vote already exists for the strip.
    var strip_name = data.text;
    if (strips[strip_name]) {
        res.send("*" + strip_name + "* is already being voted on.");
        return;
    }

    strips[strip_name] = true;

    // Initiate the vote.
    var post = yield api.slackApi("chat.postMessage", {
        channel: vote_channel,
        as_user: true,
        text: "Voting has started for *" + strip_name + "*." + vote_prompt,
    });

    // Add reactions for each animation.
    for (var animation in animations) {
        yield api.slackApi("reactions.add", {
            channel: post.channel,
            timestamp: post.ts,
            name: animations[animation],
        });
    }

    // Update every second for the duration.
    var num_reps = vote_duration / 1000;

    setIntervalX(function(rep) {
        var time_left = num_reps - rep;
        update_timer(strip_name, post, time_left);

    }, function() {
        update_strip(strip_name, post);

    }, 1000, num_reps + 1);

});

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

function update_timer(strip_name, post, time_left) {
    api.slackApi("chat.update", {
        channel: post.channel,
        ts: post.ts,
        text: "Voting has started for *" + strip_name + "*. [" + time_left + "s]" + vote_prompt,
    });
}

function update_strip(strip_name, post) {
    strips[strip_name] = false;

    // Retrieve all reactions
    api.slackApi("reactions.get", {
        channel: post.channel,
        timestamp: post.ts,
        full: true,
    }).then((res) => {

        var reactions = res.message.reactions;

        // Find the most popular valid emoji
        var high = 0;
        for (var i = 0; i < reactions.length; i++) {
            if (reactions[i].count > reactions[high].count && reactions[i].name in vote_emojis) {
                high = i;
            }
        }

        // Don't make any changes unless somebody voted.
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

                // TODO: Update Particle
            }
        }
    }).done();
}
