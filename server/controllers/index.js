const db = require("../model/db");

module.exports = {
    getIndex: (req, res) => {
        const data = {
            skills: db.get("skills").value() || [],
            products: db.get("products").value() || [],
            msgsemail: req.flash("status")[0]
        };
        res.render("index", data);
    },
    postIndex: (req, res) => {
        const data = req.body;
        db.get("contacts")
            .push({
                name: data.name,
                email: data.email,
                message: data.message || []
            })
            .write();
        req.flash("status", "Данные успешно отправились");
        res.redirect("/");
    }
};
