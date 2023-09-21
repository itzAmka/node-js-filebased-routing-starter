import express from 'express';
import dotenv from 'dotenv';
import { enableFilebasedRouting } from './enableFilebasedRouting.js'; // add .js extension so that when compiled to js, it will be able to find the file

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// enable filebased routing: any folder with a server.ts file will be treated as a route; eg: routes/another/server.ts -> /another
enableFilebasedRouting(app);

app.listen(PORT, () =>
	console.log(`Server running at http://localhost:${PORT}`),
);
