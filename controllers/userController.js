import bcrypt from "bcrypt";
import User from "../models/userModel.js";

export function createUser(req, res) {
	const hashedPassword = bcrypt.hashSync(req.body.password, 10);

	const user = new User({
		email: req.body.email,
		firstName: req.body.firstName,
		lastName: req.body.lastName,
		password: hashedPassword,
	});

	user
		.save()
		.then(() => {
			res.json({
				message: "User created successfully",
			});
		})
		.catch(() => {
			res.json({
				message: "Failed to create user",
			});
		});
}



export function isAdmin(req) {
	if (req.user == null) {
		return false;
	}
	if (req.user.role != "admin") {
		return false;
	}

	return true;
}

export function isCustomer(req) {
	if (req.user == null) {
		return false;
	}
	if (req.user.role != "user") {
		return false;
	}

	return true;
}

export function getUser(req, res) {
	if (req.user == null) {
		res.status(401).json({
			message: "Unauthorized",
		});
		return;
	} else {
		res.json(req.user);
	}
}


export async function getAllUsers(req, res) {
	if (!isAdmin(req)) {
		res.status(403).json({
			message: "Forbidden",
		});
		return;
	}
	try {
		const users = await User.find();
		res.json(users);
	} catch (err) {
		res.status(500).json({
			message: "Failed to get users",
		});
	}
}

export async function blockOrUnblockUser(req, res) {
	console.log(req.user);
	if (!isAdmin(req)) {
		res.status(403).json({
			message: "Forbidden",
		});
		return;
	}

	if (req.user.email === req.params.email) {
		res.status(400).json({
			message: "You cannot block yourself",
		});
		return;
	}

	try {
		await User.updateOne(
			{
				email: req.params.email,
			},
			{
				isBlock: req.body.isBlock,
			}
		);

		res.json({
			message: "User block status updated successfully",
		});
	} catch (err) {
		res.status(500).json({
			message: "Failed to block/unblock user",
		});
	}
}


export async function updateUserData(req, res) {
	if (req.user == null) {
		res.status(401).json({
			message: "Unauthorized",
		});
		return;
	}

	try{

		await User.updateOne({
			email: req.user.email
		},{
			firstName: req.body.firstName,
			lastName: req.body.lastName,
			image: req.body.image
		})
		res.json({
			message: "User data updated successfully",
		});
	}catch(err){
		res.status(500).json({
			message: "Failed to update user data",
		});
	}
}

export async function updatePassword(req, res) {
	if (req.user == null) {
		res.status(401).json({
			message: "Unauthorized",
		});
		return;
	}
	try{
		const hashedPassword = bcrypt.hashSync(req.body.password, 10);
		await User.updateOne({
			email: req.user.email
		},{
			password: hashedPassword
		})
		res.json({
			message: "Password updated successfully",
		});
	}
	catch(err){
		res.status(500).json({
			message: "Failed to update password",
		});
	}
}