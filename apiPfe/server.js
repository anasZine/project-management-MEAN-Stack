const express=require('express')
const userRoute=require('./routers/user.route')
const adminRoute=require('./routers/admin.route')
const app=express()
const cors = require('cors');

app.use(cors());
app.use(express.json())// ken b3ath bel json format
app.use(express.urlencoded({extended:true}))//ynjem ykon jybha mn form



app.use('/',userRoute)
app.use('/admin',adminRoute)



app.listen(2000,()=>console.log('server run in port 2000'))