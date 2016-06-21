import db from '../db';

export default {
  home: function(req, res) {
    res.sendFile(__dirname + '../public/admin.html');
  },

  pendingBid: function(req, res) {

    db.Deal.findAll({ where: { bid_Transaction: false } })
      .then(function(deals) {
        var results = [];
        for(var i = 0; i < deals.length; i++) {
          results.push(deals[i].dataValues);
          console.log(deals[i].dataValues);
        }
        res.send(results);
      })
      .catch(function(error) {
        console.log("fail to get pending bid transaction", error);
        res.send(error);
      })
  },

  contractedBid: function(req, res) {

    db.Deal.findAll({
      where: {
          bid_Transaction: true
        }
      })
      .then(function(deals) {
        var results = [];
        for (var i = 0; i < deals.length; i++) {
          console.log(deals[i].dataValues);
          results.push(deals[i].dataValues);
        }
        res.send(results);
      })
      .catch(function(error) {
        console.log("cannot retrieve bid information: ", error);
        res.send(error);
      })

  },

  getHotels: function(req, res) {
    db.Hotel.findAll()
      .then(function(hotels) {
        var results = [];
        for (var i = 0; i < hotels.length; i++) {
          results.push(hotels[i].dataValues);
          console.log(hotels[i].dataValues);
        }
        res.send(results);
      })
      .catch(function(error) {
        console.log("fail to retrieve hotel information:", error);
        res.send(error);
      })
  },

  getHotel: function(req, res) {
    db.Hotel.findAll({ where: { hotel_ID: req.params.hotel_ID }})
      .then(function(hotel) {
        console.log('getHotel: ' + req.params.hotel_ID);
        console.log(hotel[0].dataValues);
        res.send(hotel[0].dataValues);
      })
      .catch(function(error) {
        console.log("fail to retrieve hotel information: ", 
                    req.params.hotel_ID, error);
        res.send(error);
      })
  },

  getHotelsByRegion: function(req, res) {
    db.Hotel.findAll({
      where: { subArea_Name: req.params.subArea_Name }
    })
    .then(function(hotels) {
      var results = [];
      for (var i = 0; i < hotels.length; i++) {
        console.log(hotels[i].dataValues);
        results.push(hotels[i].dataValues);
      }
      res.send(results);
    })
    .catch(function(error) {
      console.log("fail to retrieve hotel information(region): ", error);
      res.send(error);
    })
  },

  getClients: function(req, res) {
    db.Client.findAll()
    .then(function(clients) {
      var results = [];
      for (var i = 0; i < clients.length; i++) {
        console.log(clients[i].dataValues);
        results.push(clients[i].dataValues);
      }
      res.send(results);
    })
    .catch(function(error) {
      console.log("cannot retrieve clients information:", error);
      res.send(error);
    })
  },

  getClient: function(req, res) {
    db.Client.findOne({ client_Email: req.params.client_Email })
    .then(function(result) {
      console.log(result.dataValues);
      res.send(result.dataValues);
    })
    .catch(function(error) {
      console.log("cannot retrieve client information:", error);
      res.send(error);
    })
  },

  deleteHotel: function(req, res) {
    db.Hotel.destroy({ where: { hotel_ID: req.params.hotel_ID } })
    .then(function(result) {
      console.log('result is :' + result);
      res.send('successfully deleted');
    })
    .catch(function(error) {
      console.log("fail to delete ", req.params.hotel_ID, " ", error);
      res.send(error);
    })
  },

  deleteClient: function(req, res) {
    db.Client.destroy( { where: {client_Email: req.params.client_Email }})
    .then(function(result) {
      console.log('result is : ' + result);
      res.send('successfully deleted');
    })
    .catch(function(error) {
      console.log("fail to delete ", req.params.client_Email, " ", error);
      res.send(error);
    })
  }
};
