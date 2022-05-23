const dbConfig = require("../config/config.js");

const Sequelize = require("sequelize");
const sequelize = new Sequelize(dbConfig.DB, dbConfig.USER, dbConfig.PASSWORD, {
  host: dbConfig.HOST,
  dialect: dbConfig.dialect
});

sequelize.authenticate().then(() => {
    console.log('Connection database successfully.')
}).catch((error) => {
    console.error('Unable to connect to the database:', error)
})

const db = {};

db.Sequelize = Sequelize;
db.sequelize = sequelize;

db.company = require("./company.js")(sequelize, Sequelize);
db.user = require("./user.js")(sequelize, Sequelize);

db.user.belongsToMany(db.company, { through: 'user_company' });
db.company.belongsToMany(db.user , { through: 'user_company' });

module.exports = db;