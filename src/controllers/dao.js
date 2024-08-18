const Dao = require("../../models/Dao");
const { Op } = require("sequelize");
const Task = require("../../models/Task");
const UserDao = require("../../models/UserDao");
const User = require("../../models/User");
const TaskUser = require("../../models/TaskUser");

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

const isDaoMember = async (req, res) => {
  const { daoId } = req.params;

  try {
    const daoMember = await UserDao.findOne({
      where: { dao_id: daoId, user_id: req.userId },
      include: {
        model: User,
      },
    });

    if (!daoMember) {
      return res.status(404).json({ error: "No such user in DAO" });
    }

    res.json(daoMember);
  } catch (error) {
    console.error("Error fetching members:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

const getDaoMembers = async (req, res) => {
  try {
    const { daoId } = req.params;

    const daoMembers = await UserDao.findAll({
      where: { dao_id: daoId },
      include: {
        model: User,
        attributes: [
          "id",
          "contract_address",
          "picture",
          "name",
          "email_address",
        ],
      },
    });

    if (!daoMembers) {
      return res.status(404).json({ error: "DAO not found" });
    }

    res.json(daoMembers);
  } catch (error) {
    console.error("Error fetching members:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

const getDaoAdmin = async (req, res) => {
  try {
    const { daoId } = req.params;

    const daoAdmin = await UserDao.findOne({
      where: { dao_id: daoId, role: "admin" },
      include: {
        model: User,
        // attributes: ["id", "contract_address", "picture", "name"],
      },
    });

    if (!daoAdmin) {
      return res.status(404).json({ error: "DAO not found" });
    }

    res.json(daoAdmin);
  } catch (error) {
    console.error("Error fetching Admin:", error);
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

    const newDao = await Dao.create({
      name,
      description,
    });

    await UserDao.create({
      user_id: req.userId,
      dao_id: newDao.id,
      role: "admin", // Set user role as admin in the join table
    });

    // await newDao.save({
    //   fields: ,
    // });

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
        name: daoData.name,
        description: daoData.description,
        image: daoData.image,
        linkedin: daoData.linkedin,
        website: daoData.website,
      },
      {
        where: {
          // email: daoData.email,
          id: { [Op.eq]: +daoId },
        },
        fields: ["name", "description", "image", "linkedin", "website"],
      }
    );

    if (updated) {
      return res.status(200).json({ updated: updated });
    }

    return res.status(404).json("No DAO found.");
  } catch (err) {
    console.log(err);
    return res.status(500).json(err);
  }
};

const deleteDao = async (req, res) => {
  const daoId = req.params.id;

  try {
    const isAdmin = await UserDao.findOne({
      where: {
        user_id: req.userId,
        dao_id: daoId,
        role: "admin",
      },
    });

    if (!isAdmin) {
      return res.status(403).json({ error: "Unauthorized to delete DAO" });
    }

    // await newDao.destroy()
    const deleted = await Dao.destroy({
      where: {
        id: { [Op.eq]: +daoId },
      },
    });

    return res.status(200).json({ deleted: deleted });
  } catch (error) {
    return res.status(500).json(error);
  }
};

const joinDao = async (req, res) => {
  const { daoId } = req.params;

  try {
    // Check if user is already a member of the DAO
    const existingMembership = await UserDao.findOne({
      where: { user_id: req.userId, dao_id: daoId },
    });

    if (existingMembership) {
      return res
        .status(400)
        .json({ error: "User already a member of this DAO" });
    }

    // Create an association between the user and the DAO
    await UserDao.create({
      user_id: req.userId,
      dao_id: daoId,
      role: "member", // Set user role as member (can be adjusted based on your requirements)
    });

    res.status(201).json({ message: "Successfully joined the DAO" });
  } catch (error) {
    console.error("Error joining DAO:", error);
    res.status(500).json({ error: "Failed to join DAO" });
  }
};

const getDaoTasks = async (req, res) => {
  try {
    const { daoId } = req.params;

    const daoTasks = await Task.findAll({
      where: { dao_id: daoId },
    });

    if (!daoTasks) {
      return res.status(404).json({ error: "No task found" });
    }

    res.json(daoTasks);
  } catch (error) {
    console.error("Error fetching tasks:", error);
    throw error; // Re-throw the error for handling at the API endpoint level
  }
};

// Endpoint for creating a task
const createDaoTask = async (req, res) => {
  const { daoId } = req.params;
  const { title, description, payment } = req.body;

  try {
    // Check if user is admin for the DAO
    const isAdmin = await UserDao.findOne({
      where: {
        user_id: req.userId,
        dao_id: daoId,
        role: "admin",
      },
    });

    if (!isAdmin) {
      return res.status(403).json({ error: "Unauthorized to create tasks" });
    }

    // Create the task with the DAO ID as foreign key
    const task = await Task.create({
      title,
      description,
      payment,
      dao_id: daoId, // Set the foreign key
    });

    await TaskUser.create({
      task_id: task.id,
      user_id: req.userId,
      role: "admin", // Set role as admin
    });

    res.status(201).json(task);
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ error: "Failed to create task" });
  }
};

const updateDaoTask = async (req, res) => {
  const { daoId, taskId } = req.params;
  const { title, description, payment, deadline, status } = req.body;

  try {
    // Check if user is admin for the DAO
    const isAdmin = await UserDao.findOne({
      where: {
        user_id: req.userId,
        dao_id: daoId,
        role: "admin",
      },
    });

    if (!isAdmin) {
      return res.status(403).json({ error: "Unauthorized to create tasks" });
    }

    // Create the task with the DAO ID as foreign key
    const existingTask = await Task.findOne({
      where: {
        id: taskId,
        dao_id: daoId,
      },
    });

    if (!existingTask) {
      return res.status(404).json({ error: "Task not found" });
    }

    // const task = await Task.create({
    //   title,
    //   description,
    //   payment,
    //   dao_id: daoId, // Set the foreign key
    // });

    if (existingTask) {
      existingTask.title = title;
      existingTask.description = description;
      existingTask.payment = payment;
      existingTask.deadline = deadline;
      existingTask.status = status;

      await existingTask.save(); // Save the updated task
      return res.status(200).json(existingTask); // Send updated task data
    }

    // await TaskUser.create({
    //   task_id: task.id,
    //   user_id: req.userId,
    //   role: "admin", // Set role as admin
    // });

    // res.status(200).json(existingTask);
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ error: "Failed to create task" });
  }
};

const updateDaoUserRole = async (req, res) => {
  const { daoId, userId } = req.params;
  const { role } = req.body;

  try {
    const user = await UserDao.findOne({
      where: {
        user_id: userId,
        dao_id: daoId,
      },
    });

    if (!user) {
      return res.status(403).json({ error: "Unauthorized to update user" });
    }

    user.role = role;
    await user.save();

    return res.status(200).json(user);

    // if (existingTask) {
    //   existingTask.title = title;
    //   existingTask.description = description;
    //   existingTask.payment = payment;
    //   existingTask.deadline = deadline;
    //   existingTask.status = status;

    //   await existingTask.save(); // Save the updated task
    //   return res.status(200).json(existingTask); // Send updated task data
    // }

    // await TaskUser.create({
    //   task_id: task.id,
    //   user_id: req.userId,
    //   role: "admin", // Set role as admin
    // });

    // res.status(200).json(existingTask);
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ error: "Failed to update dao user" });
  }
};

const deleteDaoTask = async (req, res) => {
  const { daoId, taskId } = req.params;

  try {
    const isAdmin = await UserDao.findOne({
      where: {
        user_id: req.userId,
        dao_id: daoId,
        role: "admin",
      },
    });

    if (!isAdmin) {
      return res.status(403).json({ error: "Unauthorized to create tasks" });
    }

    // Create the task with the DAO ID as foreign key
    const existingTask = await Task.findOne({
      where: {
        id: taskId,
        dao_id: daoId,
      },
    });

    if (!existingTask) {
      return res.status(404).json({ error: "Task not found" });
    }

    if (existingTask) {
      await existingTask.destroy(); // Delete the task
      return res.status(200).json({ deleted: true });
    }
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ error: "Failed to delete task" });
  }
};

module.exports = {
  getDao,
  getDaoMembers,
  getDaoAdmin,
  getDaos,
  createDao,
  updateDao,
  deleteDao,
  joinDao,
  getDaoTasks,
  createDaoTask,
  updateDaoTask,
  updateDaoUserRole,
  isDaoMember,
  deleteDaoTask,
};
