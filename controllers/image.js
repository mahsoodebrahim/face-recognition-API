const Clarifai = require("clarifai");

//You must add your own API key here from Clarifai.
const app = new Clarifai.App({
  apiKey: "fbd8583e4a0945ac9ab52c8fbf7018f0",
});

const handleImageApiCall = (req, res) => {
  const { url } = req.body;

  app.models
    .predict(Clarifai.FACE_DETECT_MODEL, url)
    .then((data) => res.json(data))
    .catch((error) => res.status(400).json("Could not interact with API"));
};

const handleImagePut = (req, res, knex) => {
  const { id } = req.body;

  // If the user exists, the entires count of this user will be returned.
  // Otherwise, status 400 is returned
  knex("users")
    .where("id", id)
    .increment("entries", 1)
    .returning("entries")
    .then((entries) => {
      if (entries.length) {
        res.json(entries[0]);
      } else {
        res.status(400).json("Unable to get entires, user does not exist");
      }
    })
    .catch((error) =>
      res.status(400).json("Unable to get entires, user does not exist")
    );
};

module.exports = {
  handleImagePut: handleImagePut,
  handleImageApiCall: handleImageApiCall,
};
