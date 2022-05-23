module.exports = (sequelize, Sequelize) => {
    const company = sequelize.define('company', {
        name: {
            type: Sequelize.STRING,
        },
    })

    return company;
};