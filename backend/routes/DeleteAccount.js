const router=require('express').Router();
const { User } = require("../models/User");
const requireAuth = require("../middlewares/requireAuth");

router.delete('/:id',requireAuth, async (req, res) => {
	try {
		console.log("heyy");
		const user = await User.findByIdAndDelete(req.params.id);
		
		if (!user) return res.status(404).send("User not found");

	  user.removeUser(user.username);
		res.send({message:`User ${user.username} deleted successfully`});
		
	} catch (error) {
		res.status(500).send({message:"Internal Server error while deleting user account"});
	}

});

module.exports=router;
