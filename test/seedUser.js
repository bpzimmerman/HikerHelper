
var seedUser = function user(models) {
    return models.User.create({
        id:1,
        email: 'example@gmail.com',
        displayName: 'Peter',
        password: '123456'
    })
    .catch(e => console.log(e));
}

module.exports = seedUser;