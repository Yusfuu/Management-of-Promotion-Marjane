import express from "express";
import { adminRouter, managerRouter, subadminRouter } from "./src/routes";
import 'dotenv/config';

const app = express();

app.use(express.json());

app.use('/admin', adminRouter);
app.use('/subadmin', subadminRouter);
app.use('/manger', managerRouter);

// app.post('/update/:id', async (req, res) => {
//   console.log(req.params.id);
//   // res.json(req.body);
//   const { id } = req.params;
//   const body = req.body;


//   const subadmin = await prisma.subadmin.update({
//     where: { id },
//     data: body,
//   });

//   res.json(subadmin);
// });


app.listen(3000, () => {
  console.log(`🚀 Server ready at: http://localhost:3000`)
});