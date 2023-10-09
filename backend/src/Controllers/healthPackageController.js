// controllers/healthPackageController.js
const HealthPackage = require("../Models/HealthPackage");

const getAllPackages = async (req, res) => {
  try {
    const packages = await HealthPackage.find();
    res.status(200).json(packages);
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
};

const subscribeToPackage = async (req, res) => {
  try {
    // Logic for a patient subscribing to a package, e.g., creating a subscription in the database, payment logic, etc.
    res.status(200).json({ message: "Subscription successful" });
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
};
// exports.createPackage = async (req, res) => {
//   try {
//     const newPackage = new HealthPackage(req.body);
//     await newPackage.save();
//     res.status(201).json(newPackage);
//   } catch (error) {
//     res.status(500).json({ error: "Server error" });
//   }
// };
// Define an asynchronous function named 'createPackage'.

//Task 11 : Add health package
const createPackage = async (req, res) => {
  try {
    // Destructure fields from request body.
    const {
      type, // Type of the package: Silver, Gold, Platinum
      annualFee, // Price per year
      doctorSessionDiscount, // Discount on doctor's session price
      medicineDiscount, // Discount on medicine ordered from pharmacy platform
      familySubscriptionDiscount, // Discount on the subscription for family members
    } = req.body;

    // Check if all fields are provided; if not, respond with a 400 status code and an error message.
    if (
      !type ||
      !annualFee ||
      !doctorSessionDiscount ||
      !medicineDiscount ||
      !familySubscriptionDiscount
    ) {
      return res.status(400).json({ error: "All fields must be provided" });
    }
    const existsName = await HealthPackage.findOne({ type });
    if (existsName) {
      return res.status(409).json({ error: "Package already Exists." });
    }    

    // Create a new health package instance with the provided data.
    const newPackage = new HealthPackage({
      type,
      annualFee,
      doctorSessionDiscount,
      medicineDiscount,
      familySubscriptionDiscount,
    });

    // Save the new package to the database.
    await newPackage.save();

    // If successful, respond with a 201 status code and the data of the new package.
    res.status(201).json({ message: "New package created", HealthPackage: newPackage});
  } catch (error) {
    // If an error occurs (e.g., a problem with the database), respond with a 500 status code and an error message.
    res.status(500).json({ error: "Server error" });
  }
};

// Task 11: update a health package
const updatePackage = async (req, res) => {
  try {
    const updatedPackage = await HealthPackage.findOneAndUpdate(
      { type: req.params.type }, // filter
      req.body, // update
      { new: true } // options
    );
    if (!updatedPackage) {
      return res.status(404).json({ error: "Package not found" });
    }
    res.status(200).json(updatedPackage);
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
};

// exports.deletePackage = async (req, res) => {
//     try {
//         await HealthPackage.findByIdAndDelete(req.params.id);
//         res.status(200).json({ message: 'Package deleted' });
//     } catch (error) {
//         res.status(500).json({ error: 'Server error' });
//     }
// };

// Task 11: delete a health package
const deletePackage = async (req, res) => {
  try {
    const deletedPackage = await HealthPackage.findOneAndDelete(
      { type: req.params.type } // filter
    );
    if (!deletedPackage) {
      return res.status(404).json({ error: "Package not found" });
    }
    res.status(200).json({ message: "Package deleted", data: deletedPackage });
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
};

module.exports = {
  subscribeToPackage,
  getAllPackages,
  deletePackage,
  updatePackage,
  createPackage,
}