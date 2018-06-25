let baseUri;

if(process.env.NODE_ENV == "development"){
  baseUri = "http://192.168.1.191:2000/api/v1/";
}else{
  // baseUri = "http://localhost:4000/api/v1/";
  baseUri = location.origin + "/api/v1/";
}

export const API_CONFIG = {
  base_uri: baseUri,
  users: "users",
  auth: 'auth',
  menus: "menus",
  abilities: "roles/abilities",
  roles: "roles",
  currentUser: "users/current_user",
  purchaseOrders: "/purchase_orders"
};
