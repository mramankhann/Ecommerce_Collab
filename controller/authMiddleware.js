const jwt = require("jsonwebtoken");

const User = require("../models/User");

const protect = async (req, res, next)=>{

    let token;

    //Check token

    if (
        req.headers.authorization &&
        req.headers.authorization.startsWith('Bearer')
    ){
        try{

            //Get token
            token = req.headers.authorization.split(" ")[1];

            //verify token
            const decoded = jwt.verify(
                token,
                process.env.JWT_SECRET
            );

            //Find User
            req.user = await User.findById(decoded.id)
                .select("-password");

            return next();

        } catch(error){
            return res.status(401).json({
                message:"Not Authorized",
            });
        }
    }
    
    if(!token){

        return res.status(401).json({
            message: "No Token"
        });

    }

}

    module.exports = protect;