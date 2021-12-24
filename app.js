import express from "express";
import { adminRouter, managerRouter, subadminRouter } from "./src/routes";
import 'dotenv/config';
import { logs } from "./src/utils/logs";

const app = express();

app.use(express.json());

const log = logs();

app.use('/admin', adminRouter);
app.use('/subadmin', subadminRouter);
app.use('/manger', managerRouter);


app.listen(3000, () => {
  console.log(`🚀 Server ready at: http://localhost:3000`)
});