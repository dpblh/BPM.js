import mongoose from 'mongoose';
import ProcessSerializer from '../../models/Process';
import Process from './Process';

export default {
  async resume(processId, contextId, status) {
    const processSerialized = await ProcessSerializer.findById(processId);
    const process = new Process(processSerialized);

    try {
      await process.resume({ contextId, status });
    } catch (ignore) {
    } finally {
      await ProcessSerializer.update(
        { _id: process.process._id },
        process.process,
        {
          upsert: true,
        },
      );
    }

    return process.process;
  },
  async run(schemeId, initState = {}) {
    const id = mongoose.Types.ObjectId();

    console.log('================', id);

    const processSerialized = {
      _id: id,
      timestamp: Date.now(),
      scheme: schemeId,
      context: {
        main: {
          stack: [
            {
              edgeId: 'main',
              state: initState,
              start_t: Date.now(),
            },
          ],
        },
      },
      eventLoop: [],
      eventAwaitLoop: [],
      tehState: {},
    };

    const process = new Process(processSerialized);
    try {
      await process.run({ schemeId });
    } catch (ignore) {
    } finally {
      await ProcessSerializer.create(process.process);
    }
    return process.process;
  },
};
