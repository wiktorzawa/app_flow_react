require('dotenv').config({ path: require('path').resolve(__dirname, '../../../.env') });

module.exports = {
  development: {
    username: 'admin',
    password: '1Nieporet!',
    database: 'msbox_db',
    host: 'flask-app-msbox.chqqwymic43o.us-east-1.rds.amazonaws.com',
    port: 3306,
    dialect: 'mysql',
    dialectOptions: {
      ssl: {
        rejectUnauthorized: false
      }
    }
  },
  test: {
    username: 'admin',
    password: '1Nieporet!',
    database: 'msbox_db',
    host: 'flask-app-msbox.chqqwymic43o.us-east-1.rds.amazonaws.com',
    port: 3306,
    dialect: 'mysql',
    dialectOptions: {
      ssl: {
        rejectUnauthorized: false
      }
    }
  },
  production: {
    username: 'admin',
    password: '1Nieporet!',
    database: 'msbox_db',
    host: 'flask-app-msbox.chqqwymic43o.us-east-1.rds.amazonaws.com',
    port: 3306,
    dialect: 'mysql',
    dialectOptions: {
      ssl: {
        rejectUnauthorized: false
      }
    }
  }
}; 