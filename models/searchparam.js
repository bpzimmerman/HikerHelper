module.exports = function(sequelize, DataTypes) {
  var SearchParam = sequelize.define("SearchParam", {
    latitude: {
      type: DataTypes.DECIMAL(10, 7),
      allowNull: false,
      validate: {
        isDecimal: true
      }
    },
    longitude: {
      type: DataTypes.DECIMAL(10, 7),
      allowNull: false,
      validate: {
        isDecimal: true
      }
    },
    maxDistance: {
      type: DataTypes.DECIMAL(10, 2),
      validate: {
        isDecimal: true
      }
    },
    minLength: {
      type: DataTypes.DECIMAL(10, 2),
      validate: {
        isDecimal: true
      }
    }
  });

  SearchParam.associate = function(models){
    SearchParam.hasMany(models.Activity, {
      onDelete: "cascade"
    });
    SearchParam.belongsTo(models.User, {
      foreignKey: {
        allowNull: false
      }
    });
  };

  return SearchParam;
};