const router=require('express').Router();
const { User } = require("../models/User");

router.delete('/:id', async (req, res) => {
	  const user = await User.findByIdAndDelete(req.params.id);
  if (!user) return res.status(404).send("User not found");
  
  res.send(user);
}
