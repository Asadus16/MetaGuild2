const Dao = require("../../models/Dao");
const Task = require("../../models/Task");
const TaskUser = require("../../models/TaskUser");
const { Op } = require("sequelize");
const User = require("../../models/User");

const getTask = async (req, res) => {
  const taskId = req.params.id;

  try {
    const task = await Task.findByPk(+taskId);

    if (task) {
      return res.status(200).json(task);
    }

    return res.status(404).json({ message: "No task found" });
  } catch (err) {
    return res.status(500).json(err);
  }
};

const getDaoTasks = async (req, res) => {
  let pageNo = 1;
  const { page } = +req.query;

  try {
    const taskCount = await Task.count();
    const pageCount = taskCount / 20;

    if (page && page > 0 && page <= pageCount) {
      pageNo = page;
    }

    const { count, rows } = await Task.findAndCountAll({
      offset: 20 * (pageNo - 1),
      limit: 20,
    });

    if (rows) {
      return res.status(200).json({ tasks: rows, count: count });
    }

    return res.status(404).json({ message: "No tasks found" });
  } catch (err) {
    return res.status(500).json(err);
  }
};

// Endpoint for assigning a user to a task
const assignTaskToUser = async (req, res) => {
  const { taskId } = req.params;
  const { userId } = req.body;
  const currentUser = req.user; // Assuming user data is available in the request

  try {
    // Check if user is admin for the DAO associated with the task
    const task = await getTaskWithDaoId(taskId); // Implement logic to fetch task and associated DAO

    if (task.daoId && !currentUser.isAdminForDao(task.daoId)) {
      // Replace with your logic
      return res.status(403).json({ error: "Unauthorized to assign users" });
    }

    // Check if user is a member of the DAO
    const isMember = await UserDao.findOne({
      where: {
        userId,
        daoId: task.daoId,
      },
    });

    if (!isMember) {
      return res.status(400).json({ error: "User is not a member of the DAO" });
    }

    // Assign user to task (implement your logic)
    await assignUserToTask(taskId, userId);

    res.status(200).json({ message: "User assigned to task successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to assign user to task" });
  }
};

// async function isUserAdminOfDao(user, daoId) {
//   // Implement logic to check user role in the DAO
//   // (e.g., check if user.role === 'admin' in UserDao join table for this daoId)
//   const dao = await Dao.findByPk(daoId, {
//     include: [
//       {
//         model: User,
//         as: "members", // Assuming 'members' is the alias for users in the UserDao association
//         where: { id: user.id, role: "admin" }, // Check for user ID and admin role
//       },
//     ],
//   });

//   return !!dao; // Return true if DAO is found with the user as an admin member
// }

// const createTask = async (req, res) => {
//   const { daoId } = req.params;
//   const { name, description } = req.body;
//   const currentUser = req.user; // Assuming user data is available in the request

//   try {
//     // Validate task data (optional, can be done before this block)
//     const validationErrors = validateTask(req.body);
//     if (validationErrors) {
//       return res.status(400).json({ errors: validationErrors });
//     }

//     // Check if user is admin of the DAO
//     const isAdmin = await isUserAdminOfDao(currentUser, daoId);
//     if (!isAdmin) {
//       return res.status(403).json({ error: "Unauthorized to create tasks" });
//     }

//     // Create the task with the DAO ID as foreign key
//     const task = await Task.create({
//       name,
//       description,
//       daoId, // Set the foreign key
//     });

//     res.status(201).json(task);
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ error: "Failed to create task" });
//   }
// };

const updateTask = async (req, res) => {
  const taskId = req.params.id;
  const taskData = req.body;

  try {
    const updated = await Task.update(
      {
        phone: taskData.phone,
        address: taskData.address,
        gender: taskData.gender,
        facebook: taskData.facebook,
        instagram: taskData.instagram,
        linkedin: taskData.linkedin,
        twitter: taskData.twitter,
      },
      {
        where: {
          email: taskData.email,
          // id: { [Op.eq]: +taskId },
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

    return res.status(404).json("No task record found.");
  } catch (err) {
    return res.status(500).json(err);
  }
};

const deleteTask = async (req, res) => {
  const taskId = req.params.id;

  try {
    const deleted = await Task.destroy({
      where: {
        id: { [Op.eq]: +taskId },
      },
    });

    res.status(200).json({ deleted: deleted });
  } catch (err) {
    res.status(500).json(err);
  }
};

module.exports = {
  getTask,
  getDaoTasks,
  // createTask,
  assignTaskToUser,
  updateTask,
  deleteTask,
};
