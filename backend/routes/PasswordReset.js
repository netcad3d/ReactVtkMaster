const router=require('express').Router();
const { User } = require("../models/User");

const Token=require("../models/token");
const sendEmail=require("../utils/sendEmail");
const crypto=require("crypto");

const Joi=require("joi");
const passwordComplexity=require("joi-password-complexity");
const bcrypt=require("bcryptjs");

// send password link

router.post("/", async (req, res) => {
	try {
		const emailSchema = Joi.object({
			email: Joi.string().required().email().label("Email"),
		})
		const { error } = emailSchema.validate(req.body);
		if (error) return res.status(400).send(error.details[0].message);
		let user = await User.findOne({ email: req.body.email });
		if(!user) return res.status(409).send({message:"User with this email does not exist"});
		let token=Token.findOne({userId:user._id});
		if(!token) {
			token=new Token({
				userId:user._id,
				token:crypto.randomBytes(12).toString("hex"),
			}).save();

			const url=`${process.env.BASE_URL}ResetPass/${user._id}/reset/${token.token}`;
			await sendEmail(user.email,"Netcad3d-Password Reset",url);
			res.status(200).send({message:"Password reset link sent to your email"});
		}

	} catch (error) {
		res.status(500).send({message:"Internal Server error"});
	}
})

//verify url
router.get("/:id/:token", async (req, res) => {
	try {
		const user= await User.findOne({_id:req.params.id});
		if(!user) return res.status(400).send({message:"Invalid link"});

		const token=await Token.findOne({userId:user._id,token:req.params.token});
		if(!token) return res.status(400).send({message:"Invalid link"});

		res.status(200).send({message:"Password reset link verified"});
		
	} catch (error) {
		res.status(500).send({message:"Internal Server error"});
	}
})

//reset password
router.post("/:id/:token", async (req, res) => {
	try {
		const passwordSchema = Joi.object({
			password: passwordComplexity().required().label("Password"),
		});
		const { error } = passwordSchema.validate(req.body);
		if(error) return res.status(400).send(error.details[0].message);

		const user = await User.findOne({ _id: req.params.id });
		if (!user) return res.status(400).send({ message: "Invalid link" });

		const token = await Token.findOne({
			userId: user._id,
			token: req.params.token,
		});
		if (!token) return res.status(400).send({ message: "Invalid link" });

		if (!user.verified) user.verified = true;

		//hash new password
		const salt = await bcrypt.genSalt(10);
		const hashPassword = await bcrypt.hash(req.body.password, salt);

		// new password db
		user.password = hashPassword;
		await user.save();
		await token.remove();

		res.status(200).send({ message: "Password reset successfully" });
	} catch (error) {
		res.status(500).send({ message: "Internal Server Error" });
	}
})

module.exports=router;