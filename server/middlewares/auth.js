const jwt = require('jsonwebtoken')

// Token verification
const verifyToken = (req, res, next) => {

    let token = req.query.token ? req.query.token : req.get('Authorization')

    if(!token){
        return res.status(401).json({
            ok: false,
            err: {
                message: "Authentication token is required"
            }
        })
    }

    jwt.verify(token, process.env.TOKEN_SEED_SIGNATURE, (err, decoded) => {
        if (err) {
            return res.status(401).json({
                ok: false,
                err:{
                    message: "Invalid token"
                }
            })
        }

        // payload
        req.user = decoded.user
        next()
    })
}

// Token verification
const verifyAdminRole = (req, res, next) => {

    let token = req.get('Authorization')
    

    if(req.user.role !== 'ADMIN_ROLE'){
        return res.status(403).json({
            ok: false,
            err:{
                message: "The user does not have sufficient permissions to perform this action"
            }
        })
    }

    next()
}


module.exports = {
    verifyToken,
    verifyAdminRole
}