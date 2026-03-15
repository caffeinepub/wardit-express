import Float0 "mo:core/Float";
import Principal "mo:core/Principal";
import Text "mo:core/Text";
import Int "mo:core/Int";
import Nat "mo:core/Nat";
import List "mo:core/List";
import Array "mo:core/Array";
import Time "mo:core/Time";
import Map "mo:core/Map";
import Order "mo:core/Order";
import Runtime "mo:core/Runtime";
import AccessControl "authorization/access-control";
import MixinAuthorization "authorization/MixinAuthorization";

actor {
  // Initialize access control
  let accessControlState = AccessControl.initState();
  include MixinAuthorization(accessControlState);

  //----------------------------
  // User Module
  //----------------------------
  type UserId = Principal;
  type Phone = Text;

  type User = {
    id : UserId;
    name : Text;
    phone : Phone;
    coachNumber : Text;
    seatNumber : Text;
    walletCredits : Float;
    referralCode : Text;
    isBNPLEnabled : Bool;
    isVerifiedTraveler : Bool;
    pnrHistory : [Text];
  };

  module User {
    public func compare(user1 : User, user2 : User) : Order.Order {
      Text.compare(user1.name, user2.name);
    };

    public func compareByCredits(user1 : User, user2 : User) : Order.Order {
      Float0.compare(user1.walletCredits, user2.walletCredits);
    };
  };

  let users = Map.empty<UserId, User>();

  public shared ({ caller }) func registerUser(name : Text, phone : Phone) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can register");
    };
    if (users.containsKey(caller)) { Runtime.trap("User already exists") };

    let user : User = {
      id = caller;
      name;
      phone;
      coachNumber = "";
      seatNumber = "";
      walletCredits = 0.0;
      referralCode = "";
      isBNPLEnabled = false;
      isVerifiedTraveler = false;
      pnrHistory = [];
    };
    users.add(caller, user);
  };

  public shared ({ caller }) func updateProfile(coachNumber : Text, seatNumber : Text) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can update profile");
    };
    switch (users.get(caller)) {
      case (null) { Runtime.trap("User does not exist") };
      case (?user) {
        let updatedUser : User = {
          user with
          coachNumber;
          seatNumber;
        };
        users.add(caller, updatedUser);
      };
    };
  };

  public query ({ caller }) func getUser(user : UserId) : async User {
    // Users can view their own data, admins can view any user
    if (caller != user and not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Can only view your own user data");
    };
    switch (users.get(user)) {
      case (null) { Runtime.trap("User does not exist") };
      case (?user) { user };
    };
  };

  public shared ({ caller }) func addCredits(amount : Float) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can add credits");
    };
    switch (users.get(caller)) {
      case (null) { Runtime.trap("User does not exist") };
      case (?user) {
        let updatedUser : User = {
          user with
          walletCredits = user.walletCredits + amount;
        };
        users.add(caller, updatedUser);
      };
    };
  };

  public shared ({ caller }) func deductCredits(amount : Float) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can deduct credits");
    };
    switch (users.get(caller)) {
      case (null) { Runtime.trap("User does not exist") };
      case (?user) {
        if (user.walletCredits < amount) { Runtime.trap("Insufficient credits") };
        let updatedUser : User = {
          user with
          walletCredits = user.walletCredits - amount;
        };
        users.add(caller, updatedUser);
      };
    };
  };

  public shared ({ caller }) func applyReferral(referralCode : Text) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can apply referral");
    };
    switch (users.get(caller)) {
      case (null) { Runtime.trap("User does not exist") };
      case (?user) {
        if (user.referralCode != "") { Runtime.trap("Referral already applied") };
        let referrerArray = users.values().toArray().filter(func(u) { u.referralCode == referralCode });
        if (referrerArray.isEmpty()) { Runtime.trap("Invalid referral code") };
        let referrer = referrerArray[0];

        let updatedUser : User = {
          user with
          walletCredits = user.walletCredits + 50.0;
          referralCode;
        };
        users.add(caller, updatedUser);

        let updatedReferrer : User = {
          referrer with
          walletCredits = referrer.walletCredits + 50.0;
        };
        users.add(referrer.id, updatedReferrer);
      };
    };
  };

  public shared ({ caller }) func storePNR(pnr : Text) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can store PNR");
    };
    switch (users.get(caller)) {
      case (null) { Runtime.trap("User does not exist") };
      case (?user) {
        let newHistory = [pnr].concat(user.pnrHistory).sliceToArray(0, 10);
        let updatedUser : User = {
          user with
          pnrHistory = newHistory;
        };
        users.add(caller, updatedUser);
      };
    };
  };

  public query ({ caller }) func getPNRHistory() : async [Text] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view PNR history");
    };
    switch (users.get(caller)) {
      case (null) { Runtime.trap("User does not exist") };
      case (?user) { user.pnrHistory };
    };
  };

  //----------------------------
  // Menu Module
  //----------------------------
  type VendorId = Nat;

  type Vendor = {
    id : VendorId;
    name : Text;
    platformNumber : Text;
    gateEntry : Text;
    isActive : Bool;
  };

  module Vendor {
    public func compare(vendor1 : Vendor, vendor2 : Vendor) : Order.Order {
      Text.compare(vendor1.name, vendor2.name);
    };

    public func compareByPlatform(vendor1 : Vendor, vendor2 : Vendor) : Order.Order {
      Text.compare(vendor1.platformNumber, vendor2.platformNumber);
    };
  };

  let vendors = Map.empty<VendorId, Vendor>();

  type MenuId = Nat;

  type MenuItem = {
    id : MenuId;
    name : Text;
    vendorId : VendorId;
    categoryName : Text;
    price : Float;
    isVeg : Bool;
    rating : Float;
    prepTimeMinutes : Nat;
    isAvailable : Bool;
  };

  module MenuItem {
    public func compare(menuItem1 : MenuItem, menuItem2 : MenuItem) : Order.Order {
      Text.compare(menuItem1.name, menuItem2.name);
    };

    public func compareByPrice(menuItem1 : MenuItem, menuItem2 : MenuItem) : Order.Order {
      Float0.compare(menuItem1.price, menuItem2.price);
    };
  };

  let menuItems = Map.empty<MenuId, MenuItem>();

  public shared ({ caller }) func addVendor(name : Text, platformNumber : Text, gateEntry : Text) : async VendorId {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can add vendors");
    };
    let id = vendors.size() + 1;
    let vendor : Vendor = {
      id;
      name;
      platformNumber;
      gateEntry;
      isActive = true;
    };
    vendors.add(id, vendor);
    id;
  };

  public shared ({ caller }) func updateVendor(id : VendorId, name : Text, platformNumber : Text, gateEntry : Text, isActive : Bool) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can update vendors");
    };
    switch (vendors.get(id)) {
      case (null) { Runtime.trap("Vendor does not exist") };
      case (?vendor) {
        let updatedVendor : Vendor = {
          id;
          name;
          platformNumber;
          gateEntry;
          isActive;
        };
        vendors.add(id, updatedVendor);
      };
    };
  };

  public shared ({ caller }) func addMenuItem(name : Text, vendorId : VendorId, categoryName : Text, price : Float, isVeg : Bool, prepTimeMinutes : Nat) : async MenuId {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can add menu items");
    };
    let id = menuItems.size() + 1;
    let menuItem : MenuItem = {
      id;
      name;
      vendorId;
      categoryName;
      price;
      isVeg;
      rating = 0.0;
      prepTimeMinutes;
      isAvailable = true;
    };
    menuItems.add(id, menuItem);
    id;
  };

  public shared ({ caller }) func updateMenuItem(id : MenuId, name : Text, vendorId : VendorId, categoryName : Text, price : Float, isVeg : Bool, prepTimeMinutes : Nat, isAvailable : Bool) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can update menu items");
    };
    switch (menuItems.get(id)) {
      case (null) { Runtime.trap("Menu item does not exist") };
      case (?menuItem) {
        let updatedMenuItem : MenuItem = {
          id;
          name;
          vendorId;
          categoryName;
          price;
          isVeg;
          rating = menuItem.rating;
          prepTimeMinutes;
          isAvailable;
        };
        menuItems.add(id, updatedMenuItem);
      };
    };
  };

  public shared ({ caller }) func toggleItemAvailability(id : MenuId) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can toggle item availability");
    };
    switch (menuItems.get(id)) {
      case (null) { Runtime.trap("Menu item does not exist") };
      case (?menuItem) {
        let updatedMenuItem : MenuItem = {
          menuItem with
          isAvailable = not menuItem.isAvailable;
        };
        menuItems.add(id, updatedMenuItem);
      };
    };
  };

  public query ({ caller }) func listVendors() : async [Vendor] {
    // Public read access - anyone can view vendors
    vendors.values().toArray().sort();
  };

  public query ({ caller }) func listMenuItems() : async [MenuItem] {
    // Public read access - anyone can view menu items
    menuItems.values().toArray().sort();
  };

  public query ({ caller }) func listMenuItemsByCategory(category : Text) : async [MenuItem] {
    // Public read access - anyone can view menu items by category
    menuItems.values().toArray().filter(func(item) { item.categoryName == category });
  };

  //----------------------------
  // Order Module
  //----------------------------
  type OrderId = Nat;

  type OrderType = {
    id : OrderId;
    userId : Principal;
    vendorId : VendorId;
    items : [{ menuItemId : Text; quantity : Nat; price : Float }];
    subtotal : Float;
    discount : Float;
    ecoPackaging : Bool;
    totalAmount : Float;
    paymentMethod : Text;
    status : Text;
    coachNumber : Text;
    seatNumber : Text;
    platformNumber : Text;
    trainNumber : Text;
    createdAt : Int;
  };

  module OrderModule {
    public func compare(order1 : OrderType, order2 : OrderType) : Order.Order {
      Int.compare(order1.createdAt, order2.createdAt);
    };

    public func compareByAmount(order1 : OrderType, order2 : OrderType) : Order.Order {
      Float0.compare(order1.totalAmount, order2.totalAmount);
    };
  };

  let orders = Map.empty<OrderId, OrderType>();

  public shared ({ caller }) func placeOrder(userId : UserId, vendorId : VendorId, items : [{ menuItemId : Text; quantity : Nat; price : Float }], paymentMethod : Text, coachNumber : Text, seatNumber : Text, platformNumber : Text, trainNumber : Text, ecoPackaging : Bool) : async OrderId {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can place orders");
    };
    // Users can only place orders for themselves
    if (caller != userId) {
      Runtime.trap("Unauthorized: Can only place orders for yourself");
    };
    let orderId = orders.size() + 1;
    let subtotal = items.foldLeft(0.0, func(acc, item) { acc + (item.price * item.quantity.toFloat()) });
    let discount = if (subtotal > 1000.0) { subtotal * 0.15 } else { 0.0 };
    let ecoPackagingFee = if (ecoPackaging) { 5.0 } else { 0.0 };
    let totalAmount = subtotal - discount + ecoPackagingFee;

    let order : OrderType = {
      id = orderId;
      userId;
      vendorId;
      items;
      subtotal;
      discount;
      ecoPackaging;
      totalAmount;
      paymentMethod;
      status = "Pending";
      coachNumber;
      seatNumber;
      platformNumber;
      trainNumber;
      createdAt = Time.now();
    };

    orders.add(orderId, order);
    orderId;
  };

  public shared ({ caller }) func cancelOrder(orderId : OrderId) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can cancel orders");
    };
    switch (orders.get(orderId)) {
      case (null) { Runtime.trap("Order does not exist") };
      case (?order) {
        // Users can only cancel their own orders
        if (caller != order.userId) {
          Runtime.trap("Unauthorized: Can only cancel your own orders");
        };
        if (order.status == "Cancelled") { Runtime.trap("Order already cancelled") };
        let cancellationTime = Int.abs(Time.now() - order.createdAt);
        if (cancellationTime > (30 * 60 * 1000000000)) { Runtime.trap("Cancellation window expired, cannot cancel order") };

        let refundAmount = order.totalAmount * 1.1;
        switch (users.get(order.userId)) {
          case (null) { Runtime.trap("User does not exist") };
          case (?user) {
            let updatedUser : User = {
              user with
              walletCredits = user.walletCredits + refundAmount;
            };
            users.add(order.userId, updatedUser);
          };
        };
        let updatedOrder : OrderType = {
          order with
          status = "Cancelled";
        };
        orders.add(orderId, updatedOrder);
      };
    };
  };

  public shared ({ caller }) func updateOrderStatus(orderId : OrderId, newStatus : Text) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can update order status");
    };
    switch (orders.get(orderId)) {
      case (null) { Runtime.trap("Order does not exist") };
      case (?order) {
        let updatedOrder : OrderType = {
          order with
          status = newStatus;
        };
        orders.add(orderId, updatedOrder);
      };
    };
  };

  public query ({ caller }) func getOrder(orderId : OrderId) : async OrderType {
    switch (orders.get(orderId)) {
      case (null) { Runtime.trap("Order does not exist") };
      case (?order) {
        // Users can view their own orders, admins can view any order
        if (caller != order.userId and not AccessControl.isAdmin(accessControlState, caller)) {
          Runtime.trap("Unauthorized: Can only view your own orders");
        };
        order;
      };
    };
  };

  public query ({ caller }) func getOrdersByUser(userId : UserId) : async [OrderType] {
    // Users can view their own orders, admins can view any user's orders
    if (caller != userId and not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Can only view your own orders");
    };
    orders.values().toArray().filter(func(order) { order.userId == userId });
  };

  public query ({ caller }) func getOrdersByVendor(vendorId : VendorId) : async [OrderType] {
    // Only admins can view orders by vendor
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can view orders by vendor");
    };
    orders.values().toArray().filter(func(order) { order.vendorId == vendorId });
  };

  public query ({ caller }) func getAllOrders() : async [OrderType] {
    // Only admins can view all orders
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can view all orders");
    };
    orders.values().toArray().sort();
  };
};
