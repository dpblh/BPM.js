import mongoose from './mongoose';

class TimeStampScheme extends mongoose.Schema {
  constructor(type) {
    super(
      {
        value: { type },
        timestamp: { type: Number },
      },
      { _id: false },
    );
  }
}

export default TimeStampScheme;
