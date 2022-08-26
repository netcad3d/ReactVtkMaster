const router=require('express').Router();
const requireAuth=require('../middlewares/requireAuth');
const { User } = require("../models/User");
const { File } = require("../models/File");

// cascade delete user and its files

router.delete('/:id', async (req, res) => {
	console.log("delete sta");
	console.log(req.params.id);
	await User.findByIdAndDelete(req.params.id);


	
  
  
  res.status(202).send({message:`User  deleted successfully`});
});

module.exports=router;