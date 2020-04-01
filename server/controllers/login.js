const auth = require("../libs/auth");
module.exports = {
    getLogin: (req, res) => {
        if (req.session.auth) {
            return res.redirect("/admin");
        }

        res.render("login", { msgslogin: req.flash("login")[0] });
    },

    postLogin: (req, res) => {
        if (req.session.auth) {
            return res.redirect("/admin");
        }

        const data = {
            email: req.body.email,
            password: req.body.password
        };

        auth.authorization(data, (err, status) => {
            if (err) {
                req.flash("login", err.message);
                return res.redirect("/login");
            }

            if (status.password && data.email === status.login) {
                req.session.auth = status.password;
                res.redirect("/admin");
            } else {
                req.flash("login", "Не правильный логин или пороль");
                return res.redirect("/login");
            }
        });
    }
};
