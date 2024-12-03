const mongoose = require("mongoose");

const schema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    photo: {
        type: String,
        required: true,
    },
});



module.exports = mongoose.model("Photo", schema);


// export default mongoose.models.foodItems || mongoose.model("FoodItems", schema);