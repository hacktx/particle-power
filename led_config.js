// Mapping of animation names to emoji names
exports.animations = {
    "Rainbow": "rainbow",
    "Solid": "sunny",
    "Alternating": "dolphin",
    "Flash": "zap",
};

// Generate voting prompt
exports.vote_prompt = "";
for (var animation in exports.animations) {
    exports.vote_prompt += "\n>:" + exports.animations[animation] + ": " + animation;
}

// Generate list of valid voting emojis
exports.vote_emojis = Object.keys(exports.animations).map((anim) => exports.animations[anim]);

// Mapping of strips to polling status
exports.strips = {
    "assembly": false,
    "blackbox": false,
    "balconyb": false,
    "balconyc": false,
    "hackroom": false,
};

exports.second_floor = ["assembly", "blackbox"];
exports.third_floor = ["hackroom", "balconyb", "balconyc"];

// Generate list of valid strips
exports.available_strips_message = "Available Strips:\nSecond Floor: [" + exports.second_floor.join(", ") + "]\nThird Floor: [" + exports.third_floor.join(", ") + "]";
