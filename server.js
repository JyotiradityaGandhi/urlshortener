const app = require('./app');
const db = require('./db');

app.listen(process.env.PORT, () => {
    console.log(`Listening to port: ${process.env.PORT}`);
});