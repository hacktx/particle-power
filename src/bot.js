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
    vote_emojis,
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

    if (data.channel_name != vote_channel.substring(1)) {
        res.send("Vote started in " + vote_channel + ".");
    }

    // Initiate the vote.
    var post = yield api.slackApi("chat.postMessage", {
        channel: vote_channel,
        as_user: true,
        text: "Voting has started for *" + strip_name + "*.",
    });

    var prompt = yield api.slackApi("chat.postMessage", {
        channel: vote_channel,
        as_user: true,
        text: vote_prompt,
    });

    // Add reactions for each animation.
    for (var animation in animations) {
        yield api.slackApi("reactions.add", {
            channel: prompt.channel,
            timestamp: prompt.ts,
            name: animations[animation],
        });
    }

    // Update every second for the duration.
    var num_reps = vote_duration / 1000;

    setIntervalX(function(rep) {
        var time_left = num_reps - rep;
        update_timer(strip_name, post, time_left);

    }, function() {
        update_strip(strip_name, post, prompt);

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
        text: "Voting has started for *" + strip_name + "*. [" + time_left + "s]",
    });
}

function update_strip(strip_name, post, prompt) {
    strips[strip_name] = false;

    // Retrieve all reactions
    api.slackApi("reactions.get", {
        channel: prompt.channel,
        timestamp: prompt.ts,
        full: true,
    }).then((res) => {

        api.slackApi("chat.delete", {
            channel: prompt.channel,
            ts: prompt.ts,
        });

        var reactions = res.message.reactions;

        // Find the most popular valid emoji
        var high = 0;
        for (var i = 1; i < reactions.length; i++) {
            if (reactions[i].count > reactions[high].count && vote_emojis.indexOf(reactions[i].name) != -1) {
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
