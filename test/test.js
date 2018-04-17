
var expect = require('chai').expect;
var chai = require('chai');
var chaiHttp = require('chai-http');
var db = require('../models');
var app = require('../routes/search-api-routes.js');
var seed = require('./seed.js');
var seedUser = require('./seedUser.js');
var express = require("express");
var exp = express();

process.env.NODE_ENV = 'test';

/* Testing Models Association */

// Models User, SearchParam and Activity associations

describe('user model', () => {
    beforeEach((done) => {
      db.sequelize.sync({ force: true }) // drops table and re-creates it
        .then(async () => {
          const user = await db.User.create({ id: 1, email: 'exampleTest@gmail.com', displayName:'Peter',  password:'123456'});
          const searchParam = await db.SearchParam.create({ id: 1, UserId: 1, latitude: 51.5033640, longitude: -0.1276250, maxDistance:30, minLength:15 });
          const activity = await db.Activity.create({ SearchParamId:1, name: 'actName', activityNum:1, difficulty:'easy', length:15, rating:3, lat:40, lng:20, imgUrl:'https://www.google.com/search?q=panda&rlz=1C5CHFA_enUS750US751&source=lnms&tbm=isch&sa=X&ved=0ahUKEwivj_7Mt7jaAhXwlOAKHQTJArgQ_AUICigB&biw=1152&bih=642#imgrc=dQoDe4rXsG5NyM:'})
          done();
        })
        .catch((error) => {
          done(error);
        });
    });
  
    it('should have all associations', async () => {
      const user = await db.User.findOne({id: 1 });
      const searchParam = await user.getSearchParams();
      const activity = await db.Activity.findOne({SearchParamId:1});
      expect(searchParam.length).to.equal(1);
      expect(searchParam[0].get().UserId).to.be.equal(1);
      expect(activity.name).to.equal('actName');
    });
  });


/* Testing Routes */

// Search Route

chai.use(chaiHttp);
// const app = api(db);

describe('Routes', () => {
    
      beforeEach(done => {
        db.sequelize.sync({ force: true, match: /travel_log/, logging: false })
        .then(() => {
          return seedUser(db);  
          return seed(db);
        }).then(() => {
          done()
        })
      })
      
      describe('Get searches', (done) => {
        it('should get a list of searches', (done) => {
          chai.request(exp)
          .get('/api/search')
          .end((err, res) => {
            expect(res.body).to.exist;
            // expect(res.send(err)).to.throw(Error);
            // expect(res).to.be.json
            done();
          })
        })
      })  
    })



