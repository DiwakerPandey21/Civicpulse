const analyzeComplaint = (text) => {
    const lowerText = text.toLowerCase();

    let category = "Others";
    let severity = "Low";

    // Keyword Dictionaries
    const keywords = {
        "Garbage dump": ["garbage", "trash", "rubbish", "dump", "waste", "plastic", "food", "smell", "stink"],
        "Yellow Spot (Public Urination Spot)": ["urine", "pee", "urination", "yellow spot", "smell", "wall"],
        "Overflow of Septic Tanks (New)": ["septic", "tank", "leak", "overflow", "sewage"],
        "Overflow of Sewerage or Storm Water": ["sewer", "storm", "drain", "clogged", "water", "gutter", "block"],
        "Dead animal(s)": ["dead", "animal", "dog", "cat", "cow", "rat", "carcass", "body"],
        "Dustbins not cleaned": ["dustbin", "bin", "full", "overflowing"],
        "Garbage vehicle not arrived": ["vehicle", "truck", "van", "collect", "driver", "came", "come"],
        "Sweeping not done": ["sweep", "broom", "dust", "dirty road", "street"],
        "No electricity in public toilet(s)": ["light", "electricity", "dark", "bulb", "power", "toilet"]
    };

    const severityHigh = ["fire", "blood", "accident", "dead", "danger", "spark", "explosion", "blocked road", "urgent", "emergency"];
    const severityMedium = ["smell", "stink", "overflow", "leak", "mess"];

    // Detect Category (Simple Score Match)
    let maxScore = 0;
    for (const [cat, words] of Object.entries(keywords)) {
        let score = 0;
        words.forEach(word => {
            if (lowerText.includes(word)) score++;
        });
        if (score > maxScore) {
            maxScore = score;
            category = cat;
        }
    }

    // Detect Severity
    if (severityHigh.some(word => lowerText.includes(word))) {
        severity = "High";
    } else if (severityMedium.some(word => lowerText.includes(word))) {
        severity = "Medium";
    }

    return { category, severity };
};

module.exports = { analyzeComplaint };
