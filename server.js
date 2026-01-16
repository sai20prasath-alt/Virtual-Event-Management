const path = require('path');
const mongoose = require('mongoose');
const app = require('./app');

require('dotenv').config({ path: path.resolve(__dirname, '.env') });

const PORT = process.env.PORT || 3000;
const DB_URL = process.env.DB_URL || process.env.MONGODB_URI || process.env.MONGO_URI;

if (!DB_URL) {
	console.error('Missing DB connection env var: set DB_URL (or MONGODB_URI/MONGO_URI) in .env');
	process.exit(1);
}

mongoose
	.connect(DB_URL, process.env.DB_NAME ? { dbName: process.env.DB_NAME } : undefined)
	.then(() => {
		console.log('Db is connected');
		app.listen(PORT, (err) => {
			if (err) {
				console.log('Something bad happened', err);
				process.exit(1);
			}
			console.log(`Server is listening on ${PORT}`);
		});
	})
	.catch((err) => {
		console.error('DB connection failed', err);
		process.exit(1);
	});

module.exports = app;