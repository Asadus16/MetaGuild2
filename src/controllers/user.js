const User = require("../../models/User");
const { Op } = require("sequelize");

const getUser = async (req, res) => {
  const userId = req.params.id;

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
        exclude: [
          "account_status",
          "email_verification_status",
          "createdAt",
          "last_login",
          "password",
          "updatedAt",
        ],
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
    const { first_name, last_name, email, password } = userData;

    const newUser = User.build({ first_name, last_name, email, password });

    await newUser.save({
      fields: ["first_name", "last_name", "email", "password"],
    });

    // await newUser.destroy()

    return res.status(201).json(newUser);
  } catch (error) {
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
          email: userData.email,
          // id: { [Op.eq]: +userId },
        },
        fields: [
          "phone",
          "address",
          "postal_code",
          "city",
          "state",
          "country",
          "gender",
          "facebook",
          "instagram",
          "linkedin",
          "twitter",
          "whatsapp",
        ],
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
