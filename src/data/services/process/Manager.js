import mongoose from 'mongoose';
import ProcessSerializer from '../../models/Process';
import Process from './Process';

export default {
  async resume(processId, contextId, status) {
    const processSerialized = await ProcessSerializer.findById(processId);
    const process = new Process(processSerialized);
    await process.resume({ contextId, status });
    await ProcessSerializer.update(
      { _id: process.process._id },
      process.process,
      {
        upsert: true,
      },
    );
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
            },
          ],
        },
      },
      eventLoop: [],
      eventAwaitLoop: [],
      eventJoinLoop: [],
      globalState: {},
    };

    const process = new Process(processSerialized);
    await process.run({ schemeId });

    await ProcessSerializer.create(process.process);

    return process.process;
  },
};
