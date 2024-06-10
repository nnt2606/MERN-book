

export const verifyRoles = (...allowedRoles) =>{
    return (req, res, next) =>{
        if(!req?.roles) return res.status(401).json({message: "req.roles is null"});
        const rolesArray = [...allowedRoles];
        const roleValues = Object.values(req.roles);
        //console.log(req.roles.User);
        const result = roleValues.map(role => rolesArray.includes(role)).find(val => val === true);
        if(!result) return res.status(401).json("No roles");
        next();
    }
}