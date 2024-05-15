const User = require("../../models/User");
const UserDao = require("../../models/UserDao");
const { Op } = require("sequelize");

const getUser = async (req, res) => {
  const userId = req.params.userId;

  try {
    const user = await User.findByPk(+userId);

    if (user) {
      return res.status(200).json(user);
    }

    return res.status(404).json({ message: "No user found" });
  } catch (err) {
    return res.status(500).json(err);
  }
};

const getMe = async (req, res) => {
  const userId = req.userId;

  try {
    const user = await User.findByPk(+userId, {
      attributes: {
        exclude: ["createdAt", "updatedAt"],
      },
    });

    if (user) {
      return res.status(200).json(user);
    }

    return res.status(404).json({ message: "No user found" });
  } catch (err) {
    return res.status(500).json(err);
  }
};

const getUsers = async (req, res) => {
  let pageNo = 1;
  const { page } = +req.query;

  try {
    const userCount = await User.count();
    const pageCount = userCount / 20;

    if (page && page > 0 && page <= pageCount) {
      pageNo = page;
    }

    const { count, rows } = await User.findAndCountAll({
      offset: 20 * (pageNo - 1),
      limit: 20,
    });

    if (rows) {
      return res.status(200).json({ users: rows, count: count });
    }

    return res.status(404).json({ message: "No users found" });
  } catch (err) {
    return res.status(500).json(err);
  }
};

const createUser = async (req, res) => {
  const userData = req.body;

  try {
    const { name, contract_address } = userData;

    const newUser = User.build({ name, contract_address });

    await newUser.save({
      fields: ["name", "contract_address"],
    });

    // await newUser.destroy()

    return res.status(201).json(newUser);
  } catch (error) {
    // console.log(error);
    return res.status(500).json(error);
  }
};

const updateUser = async (req, res) => {
  const userId = req.params.id;
  const userData = req.body;

  try {
    const updated = await User.update(
      {
        phone: userData.phone,
        address: userData.address,
        gender: userData.gender,
        facebook: userData.facebook,
        instagram: userData.instagram,
        linkedin: userData.linkedin,
        twitter: userData.twitter,
      },
      {
        where: {
          contract_address: userData.contract_address,
          // id: { [Op.eq]: +userId },
        },
        fields: ["name", "ens_address"],
      }
    );

    if (updated) {
      return res.status(200).json({ updated: updated });
    }

    return res.status(404).json("No user record found.");
  } catch (err) {
    return res.status(500).json(err);
  }
};

const deleteUser = async (req, res) => {
  const userId = req.params.id;

  try {
    const deleted = await User.destroy({
      where: {
        id: { [Op.eq]: +userId },
      },
    });

    res.status(200).json({ deleted: deleted });
  } catch (err) {
    res.status(500).json(err);
  }
};

module.exports = {
  getUser,
  getMe,
  getUsers,
  createUser,
  updateUser,
  deleteUser,
};
