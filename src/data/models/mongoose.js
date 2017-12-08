import mongoose from 'mongoose';
import config from '../../config';

// todo workaround for HMR. It remove old model before added new ones
Object.keys(mongoose.connection.models).forEach(key => {
  delete mongoose.connection.models[key];
});

mongoose.connect(config.mongo.connectionUrl, config.mongo.options);
mongoose.Promise = global.Promise;

export default mongoose;
