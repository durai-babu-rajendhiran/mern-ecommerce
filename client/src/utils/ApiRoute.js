const rawApi = process.env.REACT_APP_API || 'http://localhost:8000/api/';
const APIBASE_URL = rawApi.endsWith('/') ? rawApi : `${rawApi}/`;

// Helper function to handle fetch requests safely
const fetchRequest = async (url, method = 'GET', token = null, body = null) => {
    const cleanUrl = url.startsWith('/') ? url.slice(1) : url;
    const headers = {};
    if (!(body instanceof FormData)) {
        headers['Content-Type'] = 'application/json';
    }
    if (token) {
        headers['authtoken'] = `${token}`;
    }
    const options = {
        method,
        headers,
    };
    if (body) {
        options.body = body instanceof FormData ? body : JSON.stringify(body);
    }
    const response = await fetch(`${APIBASE_URL}${cleanUrl}`, options);
    return response.json();
};

export const BASEURL = process.env.REACT_BASE_URL || 'http://localhost:8000/';

// User API
export const createUser = (token) =>
    fetchRequest('create-or-update-user', 'POST', token);

export const getCurrentUser = (token) =>
    fetchRequest('current-user', 'POST', token);

export const getCurrentAdmin = (token) =>
    fetchRequest('current-admin', 'POST', token);

export const userCart = (cart, token) =>
    fetchRequest('user/cart', 'POST', token, cart);

export const getOrders = (token) =>
    fetchRequest('admin/orders', 'GET', token);

export const getCategory = () =>
    fetchRequest('categories', 'GET');

export const changeOrderStatus = (orderId, status, token) =>
    fetchRequest('admin/order-status', 'PUT', token, { orderId, status });

// Category API
export const getCategories = (token) =>
    fetchRequest('categories', 'GET', token);

export const removeOrUpdateCategory = (categoryId, data, token) =>
    fetchRequest(`category/${categoryId}`, 'PUT', token, data);

export const removeCategory = (categoryId, token) =>
    fetchRequest(`category/${categoryId}`, 'DELETE', token);

export const createCategory = (data, token) =>
    fetchRequest('category', 'POST', token, data);

export const getCategorySub = (categoryId) =>
    fetchRequest(`category/subs/${categoryId}`, 'GET');

// Subcategory API
export const getCreateSub = (id = false, token) =>
    fetchRequest(`sub${id ? `/${id}` : ''}`, 'GET', token);

export const CreateSub = (token, data) =>
    fetchRequest('sub', 'POST', token, data);

export const getRemoveOrUpdateSub = (subId, data, token) =>
    fetchRequest(`sub/${subId}`, 'PUT', token, data);

export const getUpdateSub = (id, token) =>
    fetchRequest(`sub/${id}`, 'GET', token);

export const deleteSub = (subId, token) =>
    fetchRequest(`sub/${subId}`, 'DELETE', token);

// Coupon API
export const getCoupons = () =>
    fetchRequest('coupons', 'GET');

export const removeCoupon = (couponId, token) =>
    fetchRequest(`coupon/${couponId}`, 'DELETE', token);

export const createCoupon = (data, token) =>
    fetchRequest('coupon', 'POST', token, data);

// Product API
export const createProduct = (data, token) =>
    fetchRequest('product', 'POST', token, data);

export const getProductByCount = (count) =>
    fetchRequest(`products/${count}`, 'GET');

export const getProducts = (data) =>
    fetchRequest('products', 'POST', null, data);

export const getRemoveOrUpdateCountProduct = (productId, data, token) =>
    fetchRequest(`product/${productId}`, 'PUT', token, data);

export const getUpdateCountProduct = (productId) =>
    fetchRequest(`product/${productId}`, 'GET');

export const productStar = (productId, star, token) =>
    fetchRequest(`product/star/${productId}`, 'PUT', token, { star });

export const fetchProductsByFilter = (arg) =>
    fetchRequest('search/filters', 'POST', null, arg);

export const getRelated = (productId) =>
    fetchRequest(`product/related/${productId}`, 'GET');

export const createPaymentIntent = (data, token) =>
    fetchRequest('create-payment-intent', 'POST', token, data);

// Image Upload
export const uploadImage = (data, token) =>
    fetchRequest('uploadimages', 'POST', token, data);

export const removeImage = (imageId, token) =>
    fetchRequest(`removeimage/${imageId}`, 'DELETE', token);

// Admin & User Order/Wishlist/Cart
export const changeStatus = (orderId, orderStatus, token) =>
    fetchRequest('admin/order-status', 'PUT', token, { orderId, orderStatus });

export const getUserOrders = (token) =>
    fetchRequest('user/orders', 'GET', token, null);

export const getWishlist = (token) =>
    fetchRequest('user/wishlist', 'GET', token, null);

export const removeWishlist = (productId, token) =>
    fetchRequest(`user/wishlist/${productId}`, 'PUT', token, null);

export const addToWishlist = (productId, token) =>
    fetchRequest('user/wishlist', 'POST', token, { productId });

export const getUserCart = (token) =>
    fetchRequest('user/cart', 'GET', token, null);

export const emptyUserCart = (token) =>
    fetchRequest('user/cart', 'DELETE', token, null);

export const saveUserAddress = (token, address) =>
    fetchRequest('user/address', 'POST', token, { address });

export const applyCoupon = (token, coupon) =>
    fetchRequest('user/cart/coupon', 'POST', token, { coupon });

export const createCashOrderForUser = (token, COD, couponTrueOrFalse) =>
    fetchRequest('user/cash-order', 'POST', token, { couponApplied: couponTrueOrFalse, COD });

// AI Agent API
export const sendAiMessage = (message) =>
    fetchRequest('ai/chat', 'POST', null, { message });

export const getAiSuggestions = () =>
    fetchRequest('ai/suggestions', 'GET');

export const getAiHealth = () =>
    fetchRequest('ai/health', 'GET');