import mongoose from "mongoose";
const Schema = mongoose.Schema;
import Review from "./review.js";
import Joi from "joi";

const listingSchema = new Schema({
  title: {
    type: String,
    required: true,
    trim:true,
    set: (v) =>
    v
      ? v
          .toLowerCase()
          .split(" ")
          .map(word => word.charAt(0).toUpperCase() + word.slice(1))
          .join(" ")
      : v,
  },
  description: {
    type:String,
    trim: true,
      set: (v) =>
        v
      ? v.charAt(0).toUpperCase() + v.slice(1).toLowerCase()
      : v,
  },

  image: {
    url:String,
    filename:String
  },
  

  price: {
  type: Number,
  required: true,
  min: 0,
  set: (v) => (v === "" ? 0 : v)
},

  location: {
    type: String,
     required: true,
     trim: true,
     match: [
    /^[A-Za-z]+(?:[ ][A-Za-z]+)*(?:, ?[A-Za-z]+(?:[ ][A-Za-z]+)*)*$/,
    "Enter valid format: City,State"
  ],

  set: (v) => {
    if (!v) return v;

    return v
      .toLowerCase()
      .split(",")
      .map(part =>
        part
          .trim()
          .replace(/\s+/g, " ") // fix extra spaces
          .replace(/\b\w/g, c => c.toUpperCase()) // capitalize each word
      )
      .join(","); // 🔥 no space after comma
  }
  },
  country: {
     type: String,
     required: true,
    trim: true,
      set: (v) =>
        v
      ? v.charAt(0).toUpperCase() + v.slice(1).toLowerCase()
      : v,
  },
  reviews:[
    {
      type:Schema.Types.ObjectId,
      ref:"Review"
    }
  ],
  owner:{
    type:Schema.Types.ObjectId,
    ref:"User",
  },
  geometry: {
    type: {
      type: String,
      enum: ['Point'],
      required:true
    },
    coordinates: {
      type:  [Number],        // [longitude, latitude]
      required: true,
      // index: '2dsphere'      // Enables fast "near", "within" queries
    }
  },
  category: {
  type: String,
  enum: [
    "Trending","Rooms","Iconic Cities","Mountains","Castle",
    "Farms","Arctic","Pools","Camping","Desert","Beach",
    "Restaurant","Skyscrapers","Others"
  ]
}
});

// listingSchema.index({ geometry: '2dsphere' });
listingSchema.post("findOneAndDelete",async(listing)=>{
  if(listing){
    await Review.deleteMany({_id:{$in:listing.reviews}});
};
});

const Listing = mongoose.model("Listing", listingSchema);
export default Listing;