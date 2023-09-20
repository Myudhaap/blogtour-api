import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

import User from "../models/User.mjs";

const secret = "test";

export const signUp = async (req, res) => {
  const { email, password, firstName, lastName } = req.body;
  try {
    const duplicate = await User.findOne({ email });

    if (duplicate) {
      return res.status(400).json({ message: "User already exists" });
    }

    const hashPass = await bcrypt.hash(password, 12);

    const result = await User.create({
      email,
      password: hashPass,
      name: `${firstName} ${lastName}`,
    });

    const token = jwt.sign({ email: result.email, id: result._id }, secret, {
      expiresIn: "1h",
    });

    return res.status(201).json({ result, token });
  } catch (err) {
    res.status(500).json({ message: "Somethin went wrong" });
    console.log(err);
  }
};

export const signIn = async (req, res) => {
  const { email, password } = req.body;
  console.log(req.body);
  try {
    const user = await User.findOne({ email }).exec();
    if (!user) return res.status(404).json({ message: "User doesn't exists" });

    const isPasswordCorrect = await bcrypt.compare(password, user.password);

    if (!isPasswordCorrect)
      return res.status(400).json({ message: "Invalid credentials" });

    const token = jwt.sign({ email: user.email, id: user._id }, secret, {
      expiresIn: "1h",
    });

    return res.status(200).json({ result: user, token });
  } catch (err) {
    res.status(500).json({ message: "Something went wrong" });
    console.log(err);
  }
};
