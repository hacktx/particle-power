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

// Generate list of valid voting emojis
exports.vote_emojis = Object.keys(exports.animations).map((anim) => exports.animations[anim]);

// Mapping of strips to polling status
exports.strips = {
    "ballroom": false,
    "assembly": false,
    "blackbox": false,
    "executive": false,
    "hackroom": false,
    "balconyb": false,
    "balconyc": false,
};

exports.second_floor = ["ballroom", "assembly", "blackbox"];
exports.third_floor = ["executive", "hackroom", "balconyb", "balconyc"];

// Generate list of valid strips
exports.available_strips_message = "Available Strips:\nSecond Floor: [" + exports.second_floor.join(", ") + "]\nThird Floor: [" + exports.third_floor.join(", ") + "]";
