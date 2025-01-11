import env from 'dotenv';
import { connectionDb } from './src/db/connection.js';
import { app } from './app.js';


env.config({ path: './.env' });

connectionDb().then(() => {
    app.on('error', (err) => {
        console.error('Error en el servidor', err);
    });

    app.listen(process.env.PORT, () => {
        console.log(`Server starting at PORT: ${process.env.PORT}`);
    });
}).catch((error) => {
    console.error('Something went wrong with MongoDB connection:', error);
});
