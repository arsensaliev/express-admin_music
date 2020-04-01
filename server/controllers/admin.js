const formidable = require("formidable");
const fs = require("fs");
const path = require("path");
const validation = require("../libs/validate");
const db = require("../model/db");

module.exports = {
    getAdmin: (req, res) => {
        if (!req.session.auth) {
            res.redirect("/login");
        }

        res.render("admin", {
            msgskill: req.flash("skills")[0],
            msgfile: req.flash("upload")[0]
        });
    },
    postAdminUpload: (req, res) => {
        const data = req.body;
        let form = new formidable.IncomingForm();
        const upload = path.join("./public", "assets", "img", "products");

        form.uploadDir = path.join(process.cwd(), upload);

        form.parse(req, (err, fields, files) => {
            if (err) {
                return;
            }

            const valid = validation.proverka(fields, files);

            if (valid.err) {
                req.flash("msgfile", "Что-то пошло не так");
                fs.unlinkSync(files.photo.path);
                return res.redirect(`/admin`);
            }
            fs.renameSync(
                files.photo.path,
                path.join(upload, files.photo.name)
            );
            console.log(fields);
            db.get("products")
                .push({
                    src: `./assets/img/products/${files.photo.name}`,
                    name: fields.name,
                    price: fields.price
                })
                .write();

            req.flash("upload", "Успешно");
            return res.redirect("/admin");
        });
    },

    postAdminSkills: (req, res) => {
        let { age, concerts, cities, years } = req.body;

        if (!age) age = 0;
        if (!concerts) concerts = 0;
        if (!cities) cities = 0;
        if (!years) years = 0;

        db.set("skills[0].number", age).value();
        db.set("skills[1].number", concerts).value();
        db.set("skills[2].number", cities).value();
        db.set("skills[3].number", years).value();

        db.write();
        req.flash("skills", "Успешно!");
        res.redirect("/admin");
    }
};
