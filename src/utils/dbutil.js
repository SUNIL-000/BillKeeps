import {Sequelize} from 'sequelize'

 export const dbConnect = async () => {
  try {
    const sequelize = new Sequelize(process.env.DB_CONNECTION_URI, {
      dialect: "postgres",
      logging: false,
    });

    await sequelize.authenticate();
    console.log("Connected to the database.");
  } catch (error) {
    console.log("Failed to Connect with the database.");
    
  }
};
// module.exports={dbConnect}