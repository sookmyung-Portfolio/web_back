
const crypto = require("crypto");
const User = require("../models/user.js");

const createSalt = () => {
		return new Promise((resolve, reject) => {
			crypto.randomBytes(64, (err, buf) => {
				if (err) reject(err);
				resolve(buf.toString("base64"));
			});
		});
}

const encodePassword = (plainPassword) => {
	return new Promise(async (resolve, reject) => {
		const salt = await createSalt();
		crypto.pbkdf2(plainPassword, salt, 121687, 64, "sha512", (err, key) => {
			if (err) reject(err);
			resolve({ hashedPassword: key.toString("base64"), salt });
		});
	});
}

const getUserHashedPassword = (userId, plainPassword) => {
	return new Promise(async (resolve, reject) => {
		const { salt } = await User.findOne({
			userId
		}).exec();
		
		crypto.pbkdf2(plainPassword, salt, 121687, 64, "sha512", (err, key) => {
			if (err) reject(err);
			resolve(key.toString("base64"));
		});
	});
}