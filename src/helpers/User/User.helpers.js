export const userCreate = async (Model, email, password, role) => {
  const user = await Model.create({ email, password, role });
  return user;
};

export const storeUserToken = async (Model, id, token) => {
  await Model.findByIdAndUpdate(id, { token: token });
};

export const fetchUserById = async (Model, id) => {
  const user = await Model.findById(id);
  return user;
};

export const fetchUserByEmail = async (Model, email) => {
  const user = await Model.findOne({ email });
  return user;
};

export const userRegisteredHistory = async (Model, id, email) => {
  await Model.create({ userId: id, email });
};

export const fetchUserByEmailAndRole = async (Model, email, role) => {
  const user = await Model.findOne({ email, role });
  return user;
};

export const registeredUsers = async (Model) => {
  const users = await Model.find();
  return users;
};

// const existingProfile = await Profile.findOne({ userId });

export const isProfileExists = async (Model, userId) => {
  return await Model.findOne({ userId });
};

export const createProfile = async (
  Model,
  firstName,
  lastName,
  email,
  userId,
  phoneNumber
) => {
  const userProfile = await Model.create({
    firstName,
    lastName,
    email,
    userId,
    phoneNumber,
  });
  return userProfile;
};

export const updateProfile = async (
  Model,
  id,
  firstName,
  lastName,
  phoneNumber
) => {
  const updatedProfile = await Model.findByIdAndUpdate(
    id,
    { $set: { firstName, lastName, phoneNumber } },
    { new: true, runValidators: true } // Options: return updated doc & run validation
  );

  return updatedProfile; // ✅ Correct return value
};

export const deleteProfile = async (Model, userId) => {
  return await Model.findByIdAndDelete(userId);
};
