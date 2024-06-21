import { Merchant } from './merchant.model.js';
import { Product } from './product.model.js';


//association
Merchant.hasMany(Product, { foreignKey: 'merchant_id' });
Product.belongsTo(Merchant, { foreignKey: 'merchant_id' });

await sequelize.sync({ alter: true })
  