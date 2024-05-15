const Dao = require("../../models/Dao");
const { Op } = require("sequelize");
const Task = require("../../models/Task");

const getDao = async (req, res) => {
  const daoId = req.params.id;

  try {
    const dao = await Dao.findByPk(+daoId);

    if (dao) {
      return res.status(200).json(dao);
    }

    return res.status(404).json({ message: "No dao found" });
  } catch (err) {
    return res.status(500).json(err);
  }
};

const getDaoMembers = async (req, res) => {
  try {
    // Extract daoId from request parameters
    const { daoId } = req.params;

    // Find the DAO with the given daoId
    const dao = await Dao.findByPk(+daoId);

    if (!dao) {
      return res.status(404).json({ error: "DAO not found" });
    }

    // Fetch all users associated with the DAO
    const members = await dao.getUsers();

    // Send the list of members as the response
    res.json({ members });
  } catch (error) {
    console.error("Error fetching members:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

const getDaos = async (req, res) => {
  let pageNo = 1;
  const { page } = +req.query;

  try {
    const daoCount = await Dao.count();
    const pageCount = daoCount / 20;

    if (page && page > 0 && page <= pageCount) {
      pageNo = page;
    }

    const { count, rows } = await Dao.findAndCountAll({
      offset: 20 * (pageNo - 1),
      limit: 20,
    });

    if (rows) {
      return res.status(200).json({ daos: rows, count: count });
    }

    return res.status(404).json({ message: "No daos found" });
  } catch (err) {
    return res.status(500).json(err);
  }
};

const createDao = async (req, res) => {
  const daoData = req.body;

  try {
    const { name, description } = daoData;

    const newDao = Dao.build({
      name,
      description,
    });

    await newDao.save({
      fields: ["name", "description"],
    });

    // await newDao.destroy()

    return res.status(201).json(newDao);
  } catch (error) {
    return res.status(500).json(error);
  }
};

const updateDao = async (req, res) => {
  const daoId = req.params.id;
  const daoData = req.body;

  try {
    const updated = await Dao.update(
      {
        description: daoData.description,
        image: daoData.image,
        linkedin: daoData.linkedin,
        website: daoData.twitter,
      },
      {
        where: {
          // email: daoData.email,
          id: { [Op.eq]: +daoId },
        },
        fields: ["description", "image", "linkedin", "website"],
      }
    );

    if (updated) {
      return res.status(200).json({ updated: updated });
    }

    return res.status(404).json("No dao record found.");
  } catch (err) {
    return res.status(500).json(err);
  }
};

const deleteDao = async (req, res) => {
  const daoId = req.params.id;

  try {
    const deleted = await Dao.destroy({
      where: {
        id: { [Op.eq]: +daoId },
      },
    });

    res.status(200).json({ deleted: deleted });
  } catch (err) {
    res.status(500).json(err);
  }
};

// Endpoint for creating a task
const createDaoTask = async (req, res) => {
  const { daoId } = req.params;
  const { name, description } = req.body;
  const currentUser = req.user; // Assuming user data is available in the request

  try {
    // Check if user is admin for the DAO
    const isAdmin = await UserDao.findOne({
      where: {
        userId: currentUser.id,
        daoId,
        role: "admin",
      },
    });

    if (!isAdmin) {
      return res.status(403).json({ error: "Unauthorized to create tasks" });
    }

    // Create the task (implement your logic)
    // const task = await createTask(daoId, name, description);

    // Create the task with the DAO ID as foreign key
    const task = await Task.create({
      name,
      description,
      daoId, // Set the foreign key
    });

    res.status(201).json(task);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to create task" });
  }
};

module.exports = {
  getDao,
  getDaoMembers,
  getDaos,
  createDao,
  updateDao,
  deleteDao,
  createDaoTask,
};
