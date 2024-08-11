const BASE_URL = process.env.REACT_APP_API

module.exports = {
   //user
    CREATE_UPDATE_USER:BASE_URL+"create-or-update-user",   
    CURRENT_USER:BASE_URL+"current-user",
    CURRENT_ADMIN:BASE_URL+"current-admin",   
    //order
    GET_ORDER:BASE_URL+"admin/orders",   
    CHANGE_STATUS:BASE_URL+"admin/order-status",
   //category
    GET_CATEGORIES:BASE_URL+"admin/categories",
    GET_CATEGORY:BASE_URL+"admin/category/",
    REMOVE_UPDATE_CATEGORY:BASE_URL+"category/",
    CREATE_CATEGORY:BASE_URL+"category",
    GET_CATEGORYSUB:BASE_URL+"category/subs/",
    //COUPON
    GET_COUPON:BASE_URL+"coupons",
    REMOVE_COUPON:BASE_URL+"coupon/",
    CREATE_COUPON:BASE_URL+"coupon",
    //PRODUCT
    CREATE_PRODUCT:BASE_URL+"product",
    GET_PRODUCT_BY_COUNT:BASE_URL+"products/",
    GET_REMOVE_UPDATE_COUNT_PRODUCT:BASE_URL+"product/",
    PRODUCT_STAR:BASE_URL+"product/",
    GET_RELATED:BASE_URL+"product/",
    FETCH_PRODUCT_BY_FILTER:BASE_URL+"product/",
    CREATE_PAYMENT_INTENT:BASE_URL+"create-payment-intent",
    //SUBCATEGORY
    GET_CREATE_SUBS:BASE_URL+"SUB",
    GET_REMOVE_UPDATE_SUB:BASE_URL+"SUB/",
    
}