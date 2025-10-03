const mongoose = require('mongoose');
const { Schema } = mongoose;
const { ObjectId } = mongoose.Types;

const MONGO_URL =
  process.argv[2] || 'mongodb://localhost:27017/erxes?directConnection=true';

if (!MONGO_URL) {
  throw new Error('MONGO_URL not provided');
}

const Channel = mongoose.model('channels', new Schema({}, { strict: false }));
const ChannelMembers = mongoose.model(
  'channel_members',
  new Schema({}, { strict: false }),
);
const Integrations = mongoose.model(
  'integrations',
  new Schema({}, { strict: false }),
);

async function migrate() {
  await mongoose.connect(MONGO_URL);
  console.log('Connected to', MONGO_URL);

  const channels = await Channel.find({}).lean();

  for (const channel of channels) {
    const channelId = channel._id.toString();

    if (channel.memberIds && channel.memberIds.length > 0) {
      for (const memberId of channel.memberIds) {
        const exists = await ChannelMembers.findOne({ channelId, memberId });
        if (!exists) {
          await ChannelMembers.create({
            channelId,
            memberId,
            role: memberId === channel.createdBy ? 'admin' : 'member',
            createdAt: new Date(),
          });
        }
      }
    }

    if (channel.integrationIds && channel.integrationIds.length > 0) {
      // Convert string IDs to ObjectIds

      for (const id of channel.integrationIds) {
        if (!id) continue;
        console.log(id, 'id...');
        try {
          const result = await Integrations.findOne({ _id: id });

          console.log(`found ${result} integrations for channel ${channelId}`);
        } catch (error) {
          console.log(`error ${error.message}`);
        }
      }
    }
  }

  console.log('Migration done ✅');
  process.exit(0);
}

// ---- Run ----
migrate().catch((err) => {
  console.error(err);
  process.exit(1);
});
