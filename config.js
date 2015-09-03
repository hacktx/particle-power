exports.bot_token = "[YOUR BOT ACCESS TOKEN HERE]";
exports.bot_port = 3000;

exports.vote_channel = "#ledparty";
exports.vote_duration = 20000;

// Mapping of animation names to emoji names
exports.animations = {
    "Fire": "fire",
    "Waves": "dolphin",
    "Lasers": "zap",
    "Snake": "snake",
    "Sunny": "sunny",
    "Alternating": "two",
};

// Generate voting prompt
exports.vote_prompt = "";
for (var animation in exports.animations) {
    exports.vote_prompt += "\n:" + exports.animations[animation] + ": " + animation;
}

// Mapping of strips to polling status
exports.strips = {
    "ballroom_entrance": false,
    "legislative_lounge": false,
    "black_box": false,
    "narnia": false,
    "balconyb": false,
    "balconyc": false,
    "hack_room": false,
};

// Generate list of valid strips
exports.valid_strip_names_message = "Valid Strip Names: [" + Object.keys(exports.strips).join(", ") + "]";
