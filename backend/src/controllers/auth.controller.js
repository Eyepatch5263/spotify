const User  = require('../models/user.model');

const authCallback = async (req, res) => {
    try {
        const { id, firstName, lastName, imageUrl } = req.body
        //check if user already exists
        console.log({ id, firstName, lastName, imageUrl})
        const user = await User.findOne({clerkId:id})
        if (!user) {
            //signup user
            await User.create({
                clerkId: id,
                fullName: `${firstName || ""} ${lastName || ""}`,
                imageUrl
            })
            res.status(200).json({ success: true, message: `User created successfully` })
        }
        return
    } catch (error) {
        console.log("Error in callbacks", error)
        return res.status(500).json({ success: false, message: "Internal server error: ", error })
    }

}

module.exports = { authCallback }