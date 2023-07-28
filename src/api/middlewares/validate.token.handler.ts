import jwt from "jsonwebtoken";

async function validateToken(req, res, next){
    let token;

    const authHeader = req.headers.Authorization || req.headers.authorization;

    if (authHeader == null){
        return res.status(401).json("User is not authorized or token is missing.");
    }

    else if (authHeader && authHeader.startsWith("Bearer")) {
        token = authHeader.split(" ")[1];        

        jwt.verify(token, process.env.SECRET, (err, decoded) => {
            if (err){
                return res.status(401).send("User is not authorized.");
            }
            req.user = decoded.user;
            next();
        });
    }
}

export {validateToken}
