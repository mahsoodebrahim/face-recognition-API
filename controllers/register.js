const handleRegister = (req, res, knex, bcrypt) => {
  const { name, email, password } = req.body;

  if (!email || !name || !password) {
    return res.status(400).json("Invalid form submission");
  }

  const hash = bcrypt.hashSync(password);

  // The transaction block will attempt to insert data into the 'login' and 'users' table.
  // If successful, the user is returned. Otherwise, status 400 and "Email already in use" is returned
  knex
    .transaction((trx) => {
      trx
        .insert({ hash: hash, email: email })
        .into("login")
        .returning("email")
        .then(
          (
            loginEmail // loginEmail is an array with 1 object
          ) =>
            knex("users")
              .returning("*")
              .insert({ name: name, email: loginEmail[0], joined: new Date() })
        )
        .then(trx.commit)
        .catch(trx.rollback);
    })
    .then((user) => res.json(user[0])) // user is an array with 1 object
    .catch((e) => res.status(400).json("Email already in use"));
};

module.exports = {
  handleRegister: handleRegister,
};
