const path = require("path");
const User = require("../../models/User");

const authenticate = async (req, res) => {
  try {
    const { contract_address } = req.body;

    // Check if user with the contract address exists
    const user = await User.findOne({
      where: { contract_address },
      attributes: ["contract_address", "id", "ens_address", "name", "picture"],
    });

    if (user) {
      //   const payload = { userId: user.id, contract_address };
      //   const token = jwt.sign(payload, secretKey);

      res.status(200).json(user);
    } else {
      const newUser = await User.create({ contract_address });

      const userResponse = {
        id: newUser.id,
        name: newUser.name,
        contract_address: newUser.contract_address,
        ens_address: newUser.ens_address,
        picture: newUser.picture,
      };
      //   const payload = { userId: newUser.id, contract_address };
      //   const token = jwt.sign(payload, secretKey);

      res.status(201).json(userResponse);
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Authentication failed" });
  }
};

module.exports = { authenticate };
