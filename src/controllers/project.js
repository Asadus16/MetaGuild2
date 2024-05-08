const Project = require("../../models/Project");
const { Op } = require("sequelize");

const getProject = async (req, res) => {
  const projectId = req.params.id;

  try {
    const project = await Project.findByPk(+projectId);

    if (project) {
      return res.status(200).json(project);
    }

    return res.status(404).json({ message: "No project found" });
  } catch (err) {
    return res.status(500).json(err);
  }
};

const getProjects = async (req, res) => {
  let pageNo = 1;
  const { page } = +req.query;

  try {
    const projectCount = await Project.count();
    const pageCount = projectCount / 20;

    if (page && page > 0 && page <= pageCount) {
      pageNo = page;
    }

    const { count, rows } = await Project.findAndCountAll({
      offset: 20 * (pageNo - 1),
      limit: 20,
    });

    if (rows) {
      return res.status(200).json({ projects: rows, count: count });
    }

    return res.status(404).json({ message: "No projects found" });
  } catch (err) {
    return res.status(500).json(err);
  }
};

const createProject = async (req, res) => {
  const projectData = req.body;

  try {
    const { first_name, last_name, email, password } = projectData;

    const newProject = Project.build({
      first_name,
      last_name,
      email,
      password,
    });

    await newProject.save({
      fields: ["first_name", "last_name", "email", "password"],
    });

    // await newProject.destroy()

    return res.status(201).json(newProject);
  } catch (error) {
    return res.status(500).json(error);
  }
};

const updateProject = async (req, res) => {
  const projectId = req.params.id;
  const projectData = req.body;

  try {
    const updated = await Project.update(
      {
        phone: projectData.phone,
        address: projectData.address,
        gender: projectData.gender,
        facebook: projectData.facebook,
        instagram: projectData.instagram,
        linkedin: projectData.linkedin,
        twitter: projectData.twitter,
      },
      {
        where: {
          email: projectData.email,
          // id: { [Op.eq]: +projectId },
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

    return res.status(404).json("No project record found.");
  } catch (err) {
    return res.status(500).json(err);
  }
};

const deleteProject = async (req, res) => {
  const projectId = req.params.id;

  try {
    const deleted = await Project.destroy({
      where: {
        id: { [Op.eq]: +projectId },
      },
    });

    res.status(200).json({ deleted: deleted });
  } catch (err) {
    res.status(500).json(err);
  }
};

module.exports = {
  getProject,
  getProjects,
  createProject,
  updateProject,
  deleteProject,
};
