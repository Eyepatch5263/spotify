const express= require('express')
const dotenv= require('dotenv')
const {clerkMiddleware}= require('@clerk/express')
const path= require('path')
const userRouter= require('./routes/user.route')
const adminRouter= require('./routes/admin.route')
const authRouter= require('./routes/auth.route')
const songsRouter= require('./routes/song.route')
const albumsRouter= require('./routes/album.route')
const statsRouter= require('./routes/stat.route')
const connectDB = require('./lib/db')
const cors=require("cors")
const fileUpload = require('express-fileupload')
const {createServer}=require('http')
const initializeSocket=require('./lib/socket')
dotenv.config()

const app= express()
const httpServer=createServer(app)

initializeSocket(httpServer)

app.use(cors(
    {
        origin:"http://localhost:3000",
        credentials:true
    }
))
app.use(clerkMiddleware())
app.use(express.json())

app.use(fileUpload({
    useTempFiles: true,
    tempFileDir: path.join(__dirname,"tmp"),
    createParentPath:true,
    limits:{
        fileSize:10*1024*1024 //10mb
    }
}))
app.use('/api/users',userRouter)
app.use('/api/admin',adminRouter)
app.use('/api/auth',authRouter)
app.use('/api/songs',songsRouter)
app.use('/api/albums',albumsRouter)
app.use('/api/stats',statsRouter)

if(process.env.NODE_ENV === 'production'){
    app.use(express.static(path.join(__dirname,'../frontend/dist')))
    app.get('*',(req,res)=>{
        res.sendFile(path.join(__dirname,'../frontend/dist/index.html'))
    }
)}

httpServer.listen(process.env.PORT,(req,res)=>{
    console.log(`server is running on port ${process.env.PORT}`)
    connectDB()
})