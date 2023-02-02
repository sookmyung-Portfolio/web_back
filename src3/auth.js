const express = require("express");
const router = express.Router();
const { check, validationResult } = require("express-validator");

const User = require("../models/user.js");
const { encodePassword, decodePassword } = require("../modules/cryptoModule.js");

router.post("/register", [
		check("userId").notEmpty().isLength({ min: 5, max: 12 }).isAlpha().isLowercase(),
		check("password").notEmpty().isLength({ min: 8, max: 16 })
	], async (req, res) => {
	try {
		console.group("detected POST request to /auth/register");
		const errors = validationResult(req);
	
		if(!errors.isEmpty()) {
			throw new Error("Invalid request body");
		}
		
		const { userId, password: plainPassword } = req.body;
		console.log(`userId: ${userId}, password: ${plainPassword}`);
		
		const { hashedPassword, salt } = await encodePassword(plainPassword);
		console.log(`hashedPassword: ${hashedPassword}, salt: ${salt}`);
	
		await User.create({ userId, hashedPassword, salt });
		res.send("Sign up complete");
		
		console.groupEnd();
	} catch (e) {
		console.log(`Error: ${e.message}`);
		console.groupEnd();
		res.status(500).send(e.message);
	}
});

router.get("/login", [
		check("userId").notEmpty().isLength({ min: 5, max: 12 }).isAlpha().isLowercase(),
		check("password").notEmpty().isLength({ min: 8, max: 16 })
	], async (req, res) => {
	try {
		console.group("detected GET request to /auth/login");
		const errors = validationResult(req);
	
		if(!errors.isEmpty()) {
			throw new Error("Invalid request body");
		}
		
		const { userId, password: plainPassword } = req.body;
		const requestUserHashedPassword = await decodePassword(userId, plainPassword);
		
		const { hashedPassword } = await User.findOne({ userId }).exec();
		console.log(hashedPassword);
		console.log(requestUserHashedPassword);
		
		if (!(requestUserHashedPassword === hashedPassword)) {
			throw new Error("Isn't match password");
		}
		
		res.send("Sign in complete");
		console.groupEnd();
	} catch (e) {
		console.log(`Error: ${e.message}`);
		console.groupEnd();
		res.status(500).send(e.message);
	}
	
});

module.exports = router;