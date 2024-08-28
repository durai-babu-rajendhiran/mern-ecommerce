const BASE_URL = process.env.REACT_APP_API

module.exports = {
    BASEURL:'http://localhost:8000/',
    // BASEURL:process.env.REACT_BASE_URL,
    //user
    CREATE_UPDATE_USER:BASE_URL+"create-or-update-user",   
    CURRENT_USER:BASE_URL+"current-user",
    CURRENT_ADMIN:BASE_URL+"current-admin",   
    //order
    GET_ORDER:BASE_URL+"admin/orders",   
    CHANGE_STATUS:BASE_URL+"admin/order-status",

   //category
    GET_CATEGORIES:BASE_URL+"categories",
    REMOVE_UPDATE_CATEGORY:BASE_URL+"category/",
    CREATE_CATEGORY:BASE_URL+"category",
    GET_CATEGORYSUB:BASE_URL+"category/subs/",

    //SUBCATEGORY
    GET_CREATE_SUBS:BASE_URL+"sub",
    GET_REMOVE_UPDATE_SUB:BASE_URL+"sub/",

    //COUPON
    GET_COUPON:BASE_URL+"coupons",
    REMOVE_COUPON:BASE_URL+"coupon/",
    CREATE_COUPON:BASE_URL+"coupon",
    //PRODUCT
    CREATE_PRODUCT:BASE_URL+"product",
    UPLOAD_IMAGE:BASE_URL+"uploadimages",
    REMOVE_IMAGE:BASE_URL+"removeimage",

    GET_PRODUCT_BY_COUNT:BASE_URL+"products/",
    GET_REMOVE_UPDATE_COUNT_PRODUCT:BASE_URL+"product/",
    CREATE_PAYMENT_INTENT:BASE_URL+"create-payment-intent",

    
}