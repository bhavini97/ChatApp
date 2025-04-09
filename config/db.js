const {Sequelize} = require('sequelize');
require('dotenv').config();

const sequelize = new Sequelize(process.env.DB_NAME,process.env.DB_USERNAME,process.env.DB_PASSWORD,{
    host :process.env.DB_HOST,
    dialect:'mysql',
    logging:false
})
const syncDB = async()=>{
    try{
        await sequelize.authenticate();
        console.log(' Database connection established');

        // Sync models
        await sequelize.sync({ alter: true });

        console.log(' All tables synchronized');

    }
    catch(err){

        console.error('Error syncing database:', err);
    }
} 
syncDB();

module.exports = sequelize;