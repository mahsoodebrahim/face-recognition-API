const handleProfileGet = (req, res, knex) => {
  const { id } = req.params;

  // If the user exists, the user will be returned.
  // Otherwise, "User Not Found" is returned
  knex("users")
    .where({
      id: id,
    })
    .select("*")
    .then((user) => {
      if (user.length) {
        // there exists a user
        res.json(user[0]);
      } else {
        res.status(400).json("User Not Found");
      }
    })
    .catch((error) => res.status(400).json("Error Getting User"));
};

module.exports = {
  handleProfileGet: handleProfileGet,
};
