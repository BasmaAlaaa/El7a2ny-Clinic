const Admin = require("../Models/Admin");
const Doctor = require("../Models/Doctor");
const Patient = require("../Models/Patient");

// exports.deleteUser = async (req, res) => {
//   try {
//     // Destructure 'username' from request parameters.
//     const { username } = req.params;
//     // Search and delete the user document where the username field equals the provided username.
//     const deletedUser = await User.findOneAndDelete({ username: username });
//     // Check if a user was actually deleted; if not, respond with a 404 status code and an error message.
//     if (!deletedUser) {
//       return res.status(404).json({ error: "User not found" });
//     }
//     // If a user was found and deleted, respond with a 200 status code and a success message.
//     res.status(200).json({ message: "User deleted successfully" });
//   } catch (error) {
//     // If an error occurs (e.g., a problem with the database), respond with a 500 status code and an error message.
//     res.status(500).json({ error: "Server error" });
//   }
// };

exports.deleteEntity = async (req, res) => {
  try {
    // Destructure 'username' and 'entityType' from request parameters.
    const { entityType, Username } = req.params;

    // Determine which model to use based on the entity type.
    let Model;
    switch (entityType.toLowerCase()) {
      case "doctor":
        Model = Doctor;
        break;
      case "patient":
        Model = Patient;
        break;
      case "admin":
        Model = Admin;
        break;
      default:
        // If the entity type is invalid/not supported, return a 400 status code and an error message.
        return res.status(400).json({ error: "Invalid entity type" });
    }
    console.log(entityType, Username); // Log the received parameters

    // Search and delete the document where the Username field equals the provided Username.
    const deletedEntity = await Model.findOneAndDelete({ Username: Username });

    // Check if an entity was actually deleted; if not, respond with a 404 status code and an error message.
    if (!deletedEntity) {
      return res.status(404).json({ error: `${entityType} not found` });
    }

    // If an entity was found and deleted, respond with a 200 status code and a success message.
    res.status(200).json({ message: `${entityType} deleted successfully` });
  } catch (error) {
    // If an error occurs (e.g., a problem with the database), respond with a 500 status code and an error message.
    res.status(500).json({ error: "Server error" });
  }
};

exports.createAdmin = async (req, res) => {
  try {
    const { Username, Password } = req.body;
    // Validate input, ensure admin does not already exist
    if (!Username || !Password) {
      throw Error("All fields must be filled.");
    }
    const existsUsername = await Admin.findOne({ Username });
    if (existsUsername) {
      return res.status(409).json({ error: "Username is already taken." });
    }
    const newAdmin = new Admin({ Username, Password });
    await newAdmin.save();
    res.status(201).json({ message: "New admin created", admin: newAdmin });
  } catch (error) {
    res.status(500).json({ error: "Server error yalhwyy" });
  }
};
exports.deleteEntity2 = async (req, res) => {
  try {
    // Destructure 'username' from request parameters.
    const { Username } = req.params;

    // Define an array of models to search through.
    const models = [Doctor, Patient, Admin];

    // Initialize a variable to store the deleted entity and the model name.
    let deletedEntity;
    let modelUsed;

    // Loop through each model and try to find and delete the entity.
    for (const Model of models) {
      deletedEntity = await Model.findOneAndDelete({ Username: Username });
      // If an entity is found and deleted, exit the loop.
      if (deletedEntity) {
        modelUsed = Model.modelName; // Assuming the model name is available on the Model object.
        break;
      }
    }

    // Check if an entity was actually deleted; if not, respond with a 404 status code and an error message.
    if (!deletedEntity) {
      return res.status(404).json({ error: "Entity not found" });
    }

    // If an entity was found and deleted, respond with a 200 status code and a success message.
    res
      .status(200)
      .json({
        message: `${modelUsed} deleted successfully`,
        data: deletedEntity,
      });
  } catch (error) {
    // If an error occurs (e.g., a problem with the database), respond with a 500 status code and an error message.
    res.status(500).json({ error: "Server error" });
  }
};
