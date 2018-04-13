module.exports = function(sequelize, DataTypes) {
  var User = sequelize.define("User", {
    email: {
      type: DataTypes.STRING,
      unique: true,
      allowNull: false,
      validate: {
        len: [7],
        notEmpty: true,
        isEmail: true
      }
    },
    displayName: {
      type: DataTypes.STRING,
      unique: true,
      allowNull: false,
      validate: {
        len: [3],
        notEmpty: true,
        isAlphanumeric: true
      }
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: true
      }
    }
  });

  User.associate = function(models){
    User.hasMany(models.SearchParam, {
      onDelete: "cascade"
    });
  };
  
  return User;
};