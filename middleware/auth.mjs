import jwt from "jsonwebtoken";
import User from "../models/User.mjs";

const secret = "test";

const auth = async (req, res, next) => {
  try {
    const token = req.headers.authorization.split(" ")[1];
    const isCustomAuth = token.length < 500;
    let decodedData;
    console.log("coba", req.headers);
    if (token && isCustomAuth) {
      decodedData = jwt.verify(token, secret);
      req.userId = decodedData?.id;
    } else {
      decodedData = jwt.decode(token);
      const googleId = decodedData?.sub.toString();
      const user = await User.findOne({ googleId }).exec();
      req.userId = user?._id;
    }
    next();
  } catch (err) {
    console.log(err);
  }
};

export default auth;
