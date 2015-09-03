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
    "ballroom_entrance": false,
    "legislative_lounge": false,
    "black_box": false,
    "narnia": false,
    "balconyb": false,
    "balconyc": false,
    "hack_room": false,
};

// Generate list of valid strips
exports.available_strips_message = "Available Strips: [" + Object.keys(exports.strips).join(", ") + "]";
