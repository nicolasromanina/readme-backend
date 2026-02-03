const mongoose = require('mongoose');

mongoose.connect('mongodb://localhost:27017/dearme')
  .then(async () => {
    const msgCollection = mongoose.connection.collection('chatmessages');
    const msgResult = await msgCollection.deleteMany({});
    console.log(`Deleted ${msgResult.deletedCount} chat message documents`);
    process.exit(0);
  })
  .catch(err => {
    console.error('Error:', err);
    process.exit(1);
  });
