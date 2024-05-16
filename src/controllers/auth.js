const path = require("path");
const User = require("../../models/User");
const jwt = require("jsonwebtoken");

const secretKey = "meta_guild";

const authenticate = async (req, res) => {
  try {
    const { contract_address } = req.body;

    // Check if user with the contract address exists
    const user = await User.findOne({
      where: { contract_address },
      attributes: ["contract_address", "id", "ens_address", "name", "picture"],
    });

    if (user) {
      const payload = { userId: user.id, contract_address };
      const token = jwt.sign(payload, secretKey);

      res.status(200).json(token);
    } else {
      const newUser = await User.create({ contract_address });

      const userResponse = {
        id: newUser.id,
        name: newUser.name,
        contract_address: newUser.contract_address,
        ens_address: newUser.ens_address,
        picture: newUser.picture,
      };
      const payload = { userId: newUser.id, contract_address };
      const token = jwt.sign(payload, secretKey);

      res.status(201).json(token);
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Authentication failed" });
  }
};

const tokenGenerator = async (req, res) => {
  // Our login logic starts here
  try {
    // Get user input
    const { contract_address } = req.body;

    // Validate user input
    if (!contract_address) {
      res.status(400).send("Contract address is required");
    }

    let oldUser;

    // Validate if user exist in our database

    oldUser = await User.findOne({
      where: { contract_address: contract_address },
      attributes: ["id", "contract_address"],
    });

    if (!oldUser) {
      return res
        .status(404)
        .json({ message: "No USER found with that contract address" });
    }

    // const isPasswordCorrect = await bcrypt.compare(password, oldUser.password);

    // if (!isPasswordCorrect)
    //   return res.status(401).json({ message: "Invalid credentials" });

    oldUser = JSON.parse(JSON.stringify(oldUser));

    // Create token

    const accessToken = jwt.sign(
      { userId: oldUser.id, contract_address },
      process.env.TOKEN_SECRET,
      {
        expiresIn: "10h",
      }
    );
    // const refreshToken = jwt.sign(
    //   { userId: oldUser.id, contract_address },
    //   process.env.REFRESH_TOKEN_SECRET,
    //   { expiresIn: "7d" }
    // );

    // save user token
    oldUser.token = accessToken;

    // user
    res.cookie("access_token", accessToken, {
      httpOnly: true,
      secure: false, // Recommended to use HTTPS only
      sameSite: "None",
    });

    return res.json({ access_token: accessToken });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ error: err });
  }
  // Our register logic ends here
};

module.exports = { authenticate, tokenGenerator };
