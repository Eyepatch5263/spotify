//internal server error handler

const errorHandler =(error,res)=>{
    res.status(500).json({message:"Internal Server Error ",error })
}

module.exports={errorHandler}