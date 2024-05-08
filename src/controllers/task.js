const Task = require("../../models/Task");
const { Op } = require("sequelize");

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

const getTasks = async (req, res) => {
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

const createTask = async (req, res) => {
  const taskData = req.body;

  try {
    const { first_name, last_name, email, password } = taskData;

    const newTask = Task.build({ first_name, last_name, email, password });

    await newTask.save({
      fields: ["first_name", "last_name", "email", "password"],
    });

    // await newTask.destroy()

    return res.status(201).json(newTask);
  } catch (error) {
    return res.status(500).json(error);
  }
};

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
  getTasks,
  createTask,
  updateTask,
  deleteTask,
};
