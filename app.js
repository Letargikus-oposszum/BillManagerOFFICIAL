import express from 'express';
import cors from 'cors'; 
import router from './routes/routes.js';

const app = express();

app.use(cors());  

app.use(express.json());
app.use('/routes', router);

app.listen(3000, (req, res) => {
  console.log(`The server is running on port 3000`);
});
