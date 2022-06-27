
async function userVerificationCheck(req, res, next) {
    const cookieData = await req.cookies; // took cookie data
  
    const jwtData = cookieData.jwt ?? ""; // got the jwt cookie from the cookie data
  
    var decoded =
      jwtData.maxAge === 0 ? null : jwt.verify(jwtData, "codeDrill secret"); // decoded the jwt token from the cookie data
    var admin = decoded ? await Admin.findById(decoded?.id) : null; // taken the user id from the jwt and look for the user in the admin
    var user = decoded ? await Employee.findById(decoded?.id) : null; // taken the user data from the jwt and look for the user in emp
  
    if (admin) {
      return {
        type: "admin",
        verified: true,
      };
    } else if (user) {
      return {
        type: "emp",
        verified: true,
      };
    } else {
      return {
        type: undefined,
        verified: false,
      };
    }
  }


export default userVerificationCheck;