module.exports = function(sequelize, DataTypes) {
  var Activity = sequelize.define("Activity", {
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        len: [3],
      }
    },
    activityNum: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        isInt: true
      }
    },
    difficulty: {
      type: DataTypes.STRING
    },
    length: {
      type: DataTypes.DECIMAL(10, 2),
      validate: {
        isDecimal: true
      }
    },
    rating: {
      type: DataTypes.DECIMAL(10, 1),
      validate: {
        isDecimal: true
      }
    },
    lat: {
      type: DataTypes.DECIMAL(10, 7),
      validate: {
        isDecimal: true
      }
    },
    lng: {
      type: DataTypes.DECIMAL(10, 7),
      validate: {
        isDecimal: true
      }
    },
    imgUrl: {
      type: DataTypes.STRING,
      validate: {
        isUrl: true
      }
    }
  });

  Activity.associate = function(models){
    Activity.belongsTo(models.SearchParam, {
      foreignKey: {
        allowNull: false
      },
      onDelete: "cascade"
    });
  };

  return Activity;
};