
var seed = function(models) {
    return models.SearchParam.create({
        UserId: 1,
        latitude: 51.5033640,
        longitude: -0.1276250,
        maxDistance: 30,
        minLength: 15
    },
        {
            include: [models.Activity, models.User]
        })
        .catch(e => console.log(e));
}

module.exports = seed;