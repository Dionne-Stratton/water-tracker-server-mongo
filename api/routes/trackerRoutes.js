const router = require("express").Router();
const mongoose = require("mongoose");
const Tracker = mongoose.model("Tracker");

//profile CRUD routes

//create:
router.post("/", async (req, res) => {
  const reqBody = { ...req.body };

  try {
    const track = new Tracker(reqBody);
    await track.save();
  } catch (error) {
    res.status(500).send(error.message);
  }
});

//read all:
router.get("/", async (req, res) => {
  try {
    const track = await Tracker.find();
    if (!track) {
      return res.status(404).send({ error: "tracker empty" });
    }
    res.send(track);
  } catch (error) {
    res.status(500).send(error.message);
  }
});

// router.get("/:id", async (req, res) => {
//   try {
//     const track = await Tracker.findOne({ _id: req.params.id });
//     if (!track) {
//       return res.status(404).send({ error: "tracked item not found" });
//     }
//     res.send(track);
//   } catch (error) {
//     res.status(500).send(error.message);
//   }
// });

//update by id:
router.put("/:id", async (req, res) => {
  try {
    await Tracker.updateOne({ _id: req.params.id }, req.body);
    let updatedTracking = await Tracker.findOne({ _id: req.params.id });
    if (!updatedTracking) {
      return res.status(404).send({ error: "tracked item not found" });
    }
    res.send(updatedTracking);
  } catch (error) {
    res.status(500).send(error.message);
  }
});

//delete by id:
router.delete("/:id", async (req, res) => {
  try {
    const deleteTracking = await Tracker.deleteOne({ _id: req.params.id });
    if (!deleteTracking) {
      return res.status(404).send({ error: "tracked item not found" });
    }
    res.send(`${deleteTracking.deletedCount} tracked item deleted`);
  } catch (error) {
    res.status(500).send(error.message);
  }
});

module.exports = router;
