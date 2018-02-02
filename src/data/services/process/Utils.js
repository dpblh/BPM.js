import mongoose from 'mongoose';

export const getId = () => mongoose.Types.ObjectId().toString();

export default {
  getId,
};
