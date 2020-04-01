const crypto = require("crypto");
const db = require("../model/db");

module.exports.authorization = (data, cb) => {
    const user = db
        .get("users")
        .find({ email: data.email })
        .value();

    if (user) {
        crypto.pbkdf2(
            data.password,
            user.salt,
            1000,
            512,
            "sha512",
            (err, hash) => {
                if (err) {
                    return cb(
                        new Error("Возникла ошибка, попробуйте ещё!"),
                        null
                    );
                }
                cb(null, {
                    login: user.email,
                    password: hash.toString("hex") === user.hash
                });
            }
        )
    } else {
        cb(null, {
            login: null,
            password: null
        })
    }
};

module.exports.setUser = data => {
    const salt = crypto.randomBytes(16).toString("hex");
    crypto.pbkdf2(data.password, salt, 1000, 512, "sha512", (err, hash) => {
        db.get("users")
            .push({
                email: data.email,
                salt,
                hash: hash.toString("hex")
            })
            .write();
    });
};
