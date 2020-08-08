import 'reflect-metadata';
import { config } from './config';
import { createApp } from './server/app';
import { createConnection } from './model';
import { mongoose } from '@typegoose/typegoose';

(async function () {
  // Create connection to database
  await createConnection();

  // Make Mongoose use `findOneAndUpdate()`. Note that this option is `true`
  // by default, you need to set it to false.
  mongoose.set('useFindAndModify', false);

  const app = await createApp();

  app.listen(config.get('port'), () => {
    console.log(`Server listening on port "${config.get('port')}"`);
  });
})();
