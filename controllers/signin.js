const handleSignin = (req, res, knex, bcrypt) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json("Invalid form submission");
  }
  // If the provided password matches that stored in the database, the user is returend
  // Otherwise, status 400 and "Invalid Credentials" is returned
  // If there is an error accessing the database, status 400 and "Unable to get user" is returned

  knex("login")
    .select("hash")
    .where("email", email)
    .then((data) => {
      const isValidPassword = bcrypt.compareSync(password, data[0].hash); // compare user entered password to that stored in database
      if (isValidPassword) {
        return knex
          .select("*")
          .from("users")
          .where("email", email)
          .then((user) => res.json(user[0]))
          .catch((e) => res.status(400).json("Unable to get user"));
      } else {
        res.status(400).json("Invalid Credentials");
      }
    })
    .catch((e) => res.status(400).json("Unable to get user"));
};

module.exports = {
  handleSignin: handleSignin,
};
