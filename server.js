const app = require('./src/app');
const config = require('./src/config/config');

app.listen(config.PORT, (err) => {
  if (err) console.error(err);
  else {
    console.log('------- Server started on port 3000 --------');
  }
});
