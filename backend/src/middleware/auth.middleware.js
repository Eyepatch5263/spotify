const {clerkClient} = require('@clerk/express')

const protectedRoute=async(req,res,next) => {
    if(!req.auth.userId){
        return res.status(401).json({message:"Unauthorized access"})
    }
    next()
}

const isAdmin=async(req, res, next) => {
    const userId = req.auth.userId
    try {
        if (!userId) {
            return res.status(400).json({ error: 'Error: No signed-in user' })
        }
        
        const currentUser=await clerkClient.users.getUser(userId)
        const isAdmin=process.env.ADMIN_EMAIL===currentUser.primaryEmailAddress?.emailAddress
        if(!isAdmin){
            return res.status(403).json({message:"You must be an admin"})
        }
        next()
    } catch (error) {
        console.log(error)
        return res.status(500).json({message:"Internal Server Error", error})
    }
}

module.exports={isAdmin, protectedRoute}