const express = require('express')
const app = express()
const port = 3000
const bodyParser = require('body-parser')

// Config server
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))

// Sequelize
const db = require("./models");
db.sequelize.sync({ alter: true }).then(() => {
    console.log('All models were synchronized successfully.')
}).catch((error) => {
    console.log(error)
})

const Company = db.company;
const User = db.user;

// ------------ COMPANIES --------------------------
app.get('/companies', async (req, res) => {
    const companies = await Company.findAll({
        include: [
            {
                model: User,
                attributes: ["id", "name"],
                through: {
                    attributes: [],
                }
            },
        ]
    })
    res.status(200).send(companies)
});

app.post('/company', async (req, res) => {
    await Company.create(req.body)
    res.status(200).send("company created")
});

app.get('/company/:id', async (req, res) => {
    const company = await Company.findAll({ limit: 1, where: { id: req.params.id } })
    res.status(200).send(company)
});

app.put('/company/:id', async (req, res) => {
    await Company.update(req.body, { where: { id: req.params.id } })
    res.status(200).send("Company updated")
});

app.delete('/company/:id', async (req, res) => {
    await Company.destroy({
        where: { id: req.params.id }
    })
    res.status(200).send("Company deleted")
});

app.post('/company/add-user', async (req, res) => {
    const companyId = req.body.companyId;
    const userId = req.body.userId;

    Company.findByPk(companyId)
        .then((company) => {
            if (!company) {
                console.log("company not found!");
                return null;
            }
            return User.findByPk(userId).then((user) => {
                if (!user) {
                    console.log("user not found!");
                    return null;
                }

                company.addUser(user);
                console.log(`------Added User id=${user.id} to company id=${company.id}`);
                res.send(user);
            });
        })
        .catch((err) => {
            console.log("Error when adding company to User: ", err);
        });
});

// ------------ END COMPANIES --------------------------

// ------------ USERS --------------------------
app.get('/users', async (req, res) => {
    const societies = await User.findAll({
        include: [
            {
                model: Company,
                attributes: ["id","name"],
                through: {
                    attributes: [],
                }
            },
        ]
    })
    res.status(200).send(societies)
});

app.post('/user', async (req, res) => {
    await User.create(req.body)
    res.status(200).send("User created")
});

app.get('/user/:id', async (req, res) => {
    const company = await User.findAll({ limit: 1, where: { id: req.params.id } })
    res.status(200).send(company)
});

app.put('/user/:id', async (req, res) => {
    await User.update(req.body, { where: { id: req.params.id } })
    res.status(200).send("User updated")
});

app.delete('/user/:id', async (req, res) => {
    await User.destroy({
        where: { id: req.params.id }
    })
    res.status(200).send("User deleted")
});

app.post('/user/add-company', async (req, res) => {
    const companyId = req.body.companyId;
    const userId = req.body.userId;

    User.findByPk(userId)
        .then((user) => {
            if (!user) {
                console.log("User not found!");
                return null;
            }
            return Company.findByPk(companyId).then((company) => {
                if (!company) {
                    console.log("company not found!");
                    return null;
                }

                user.addCompany(company);
                console.log(`------Added User id=${user.id} to company id=${company.id}`);
                res.send(user);
            });
        })
        .catch((err) => {
            console.log("Error when adding company to User: ", err);
        });
});

// ------------- END USERS ----------------

// First endpoint
app.get('/', (req, res) => {
    res.status(200).send('Welcome to API')
})

// Server start
app.listen(port, () => {
    console.log('app listening in port ' + port)
})