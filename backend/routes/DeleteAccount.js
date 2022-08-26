const router=require('express').Router();
const requireAuth=require('../middlewares/requireAuth');
const { User } = require("../models/User");


router.delete('/:id', async (req, res) => {
	console.log("delete sta");
	console.log(req.params.id);
	  const user = await User.findByIdAndDelete(req.params.id);
  if (!user) return res.status(404).send("User not found");
  user.removeUser();
  
  res.status(202).send({message:`User ${user.username} deleted successfully`});
});

module.exports=router;