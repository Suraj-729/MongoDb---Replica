const { getCollection, addUser, userFields } = require('./model');

// Insert into Primary and sync to ReplicaDbSecondary.Primary
exports.createPrimary = async (req, res) => {
  try {
    // Insert into primary
    const primaryCollection = await getCollection('ReplicaDb', 'Primary');
    const result = await primaryCollection.insertOne(req.body);

    // Insert into secondary (on port 27018)
    const secondaryCollection = await getCollection('ReplicaDb', 'Primary', true);
    await secondaryCollection.insertOne({ ...req.body, _id: result.insertedId });

    res.status(201).json({ ...req.body, _id: result.insertedId });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.getPrimary = async (req, res) => {
  try {
    const collection = await getCollection('ReplicaDb', 'Primary');
    const docs = await collection.find().toArray();
    res.json(docs);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Read from ReplicaDb.Primary on secondary server
exports.getSecondary = async (req, res) => {
  try {
    const collection = await getCollection('ReplicaDb', 'Primary', true); // useSecondary = true
    const docs = await collection.find().toArray();
    res.json(docs);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Controller for adding a user dynamically
const addUserController = async (req, res) => {
  try {
    // Build user object dynamically from userFields
    const user = {};
    userFields.forEach(field => {
      user[field] = req.body[field];
    });

    // Optionally: Validate required fields here

    const result = await addUser(user);
    res.status(201).json({ message: 'User added successfully', userId: result.insertedId });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  createPrimary: exports.createPrimary,
  getPrimary: exports.getPrimary,
  getSecondary: exports.getSecondary,
  createUser: addUserController
};
