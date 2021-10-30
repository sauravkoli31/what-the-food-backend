import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();
const { mongo } = mongoose;
const collectionName = process.env.MONGODB_COLLECTION;

const restaurantSchema = new mongoose.Schema({
  id: {
    type: Number,
  },
  areas: {
    type: [mongoose.Schema.Types.Mixed],
  },
  branchId: {
    type: Number,
  },
  branchSlug: {
    type: String,
  },
  cities: {
    type: [mongoose.Schema.Types.Mixed],
  },
  cuisineString: {
    type: String,
  },
  cuisines: {
    type: [mongoose.Schema.Types.Mixed],
  },
  description: {
    type: String,
  },
  groupId: {
    type: Number,
  },
  heroImage: {
    type: String,
  },
  logo: {
    type: String,
  },
  mostSellingItems: {
    type: Array,
  },
  name: {
    type: String,
  },
  rate: {
    type: Number,
  },
  shopsCount: {
    type: Number,
  },
  status: {
    type: String,
  },
  statusCode: {
    type: Number,
  },
});

const restaurantsModel = mongoose.model(collectionName, restaurantSchema);
export default restaurantsModel;
