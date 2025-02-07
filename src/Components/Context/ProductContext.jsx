// productStorage.js

let productDetails = {
    productcategory: "",
    productcode: "",
    productname: "",
    gwt: 0,
    bswt: 0,
    aswt: 0,
    nwt: 0,
    pieces: 0,
    
  };
  
  export const setProductDetails = (details) => {
    productDetails = { ...details };
  };
  
  export const getProductDetails = () => {
    return productDetails;
  };
  