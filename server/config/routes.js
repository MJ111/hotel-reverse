/*-------------------------------------------------------------------
  <routes.js>
    - define all the routes to the server  
 *-------------------------------------------------------------------*/


// var linksController = require('../links/linkController.js');
// var userController = require('../users/userController.js');
// var helpers = require('./helpers.js'); // our custom middleware


/*
  1. user(customer)
    - signup
      * method: post
      * url: /user/signup
    - signin
      * method: post
      * url: /user/signin
    - request contract
      * method: put
      * url: /user/contract/:userid (or :email or phone)
    - retrieve contract(all)
      * method: get
      * url: /user/:userid (or :email or :phone)
    - retrieve contract(specific)
      * method: post
      * url: /user/contract/:userid/:contractid
    - cancel contract
      * method: delete
      * url: /user/contract/:userid/:contractid
    - feedback
      * method: post
      * url: /user/feedback
    - update user information
      * method: post
      * url: /user/info/:userid
  2. user(hotel manager)
    - signup
      * method: post
      * url: /manager/signup
    - signin
      * method: post
      * url: /manager/signin
    - retrieve bidding information (not yet contracted)
      * method: get
      * url: /manager/bidinfo
    - retrieve bids (from YYYYMMDD to YYYYMMDD, contracted)
      * method: post
      * url: /manager/bidinfo/:yyyymmdd/:yyyymmdd
    - bid (try to bid)
      * method: post
      * url: /manager/bid
    - update hotel(including hotel manager) information
      * method: post
      * url: /manager/hotel
  3. user(admin)
    - start page
      * method: get
      * url: /admin
    - signin
      * method: post
      * url: /admin/signin
    - delete user
      * method: delete
      * url: /admin/:userid
    - delete hotel
      * method: delete
      * url: /admin/:hotelid
    - retrieve pending bid
      * method: get
      * url: /admin/pendingbid
    - retrieve contracted bid
      * method: post
      * url: /admin/bidinfo/:yyyymmdd/:yyyymmdd
    - retrieve hotels
      * method: get
      * url: /admin/hotels
    - retrieve hotel
      * method: post
      * url: /admin/hotels/:hotel_id
    - retrieve hotels(region)
      * method: post
      * url: /admin/hotels/region
    - retrieve users
      * method: get
      * url: /admin/users
    - retrieve user
      * method: post
      * url: /admin/users/:userid
    - update admin
      * method: post
      * url: /admin/info
 */
module.exports = function (app, express) {

  // client
  //  - instead of client_ID, use client_Email
  //  - because not all clients are members (in this case, no client_ID)
  //  
  //  - client can send booking_Num
  //  - that's because when sending contract info, booking_Num 
  app.post('/client/signup', clientController.signUp);
  app.post('/client/signin', clientController.signIn);

  app.put('/client/bid/:client_Email', clientController.makeContract);
  app.post('/client/bid/:client_Email', clientController.getAllcontracts);
  app.post('/client/bid/:client_Email/:booking_Num', clientController.getContract);
  app.delete('/client/bid/:client_Email/:booking_Num', clientController.cancelContract);
  
  app.post('/client/feedback/:client_Email/:booking_Num', clientController.makeFeedback)

  app.post('/client/info/:client_Email', clientController.updateInfo);


  // hotel
  app.post('/hotel/signup', managerController.singUp);
  app.post('/hotel/signin', managerController.signIn);

  // startDate: yyyymmdd, endDate: yyyymmdd
  app.post('/hotel/bid/:hotel_ID', managerController.bidInfo);
  app.post('/hotel/bid/:hotel_ID/:startDate/:endDate', managerController.bidInfoInterval);

  app.put('/hotel/:booking_Num', managerController.bid);
  app.post('/hotel/update/:hotel_ID', managerController.update);
  
  
  // admin
  app.get('/admin', adminController.home);
  // app.post('/admin/signin', adminController.singIn);
  
  // don't need I think, app.delete('/admin/:userid', adminController.deleteUser);
  app.delete('/admin/:hotelid', adminController.deleteHotel);
  
  // startDate: yyyymmdd, endDate: yyyymmdd
  app.get('/admin/pendingbid', adminController.pendingBid);
  app.get('/admin/bidinfo/:startDate/:endDate', adminController.contractedBid);

  app.get('/admin/hotels', adminController.getHotels);
  app.post('/admin/hotels/:hotel_ID', adminController.getHotel);
  app.get('/admin/hotels/subArea_Name', adminController.getHotelsByRegion);

  app.get('/admin/clients', adminController.getClients);
  app.post('admin/clients/:client_Email', adminController.getClient);

  //app.post('/admin/info', adminController.updateAdmin);

};