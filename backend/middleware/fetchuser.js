var jwt = require('jsonwebtoken');
const jwt_secret = "Hell@how@reyou";
const fetchuser = async (req, res, next) =>{

    const token = req.header('auth-token');

    if(!token){
        res.status(401).send({error: "Please authenticate with valid token!"});
    }

    const data = jwt.verify(token,jwt_secret);
    req.user = data.user;    
    next();
}

module.exports = fetchuser;