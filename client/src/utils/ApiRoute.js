const APIBASE_URL = process.env.REACT_APP_API || 'http://localhost:8000/';

// Helper function to handle fetch requests
const fetchRequest = async (url, method = 'GET', token = null, body = null) => {
    const headers = {
        'Content-Type': 'application/json',
    };
    if (token) {
        headers['authtoken'] = `${token}`;
    }
    const options = {
        method,
        headers,
    };
    if (body) {
        options.body = body instanceof FormData ? body : JSON.stringify(body);
        if (body instanceof FormData) delete headers['Content-Type'];
    }
    const response = await fetch(`${APIBASE_URL}${url}`, options);
    return response.json();
};

// User API
export const BASEURL ='http://localhost:8000/'

export const createUser = (token) =>
    fetchRequest('create-or-update-user', 'POST', token);

export const getCurrentUser = (token) =>
    fetchRequest('current-user', 'POST', token);

export const getCurrentAdmin = (token) =>
    fetchRequest('current-admin', 'POST', token);

// Order API
export const getOrders = () =>
    fetchRequest('admin/orders', 'GET');

export const changeOrderStatus = (orderId, status) =>
    fetchRequest('admin/order-status', 'PUT', null, { orderId, status });

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
export const getCreateSub = (id = false,token) =>
    fetchRequest(`sub${id ? `/${id}` : ''}`, 'GET', token);

export const CreateSub = (token,data) =>
    fetchRequest(`sub`, 'POST', token,data);

export const getRemoveOrUpdateSub = (subId, data, token) =>
    fetchRequest(`sub/${subId}`, 'PUT', token, data);

export const getUpdateSub = (id, token) =>
    fetchRequest(`sub/${id}`, 'GET', token);

export const deleteSub = (subId, token) =>
    fetchRequest(`sub/${subId}`, 'DELETE', token);

// Coupon API
export const getCoupons = () =>
    fetchRequest('coupons', 'GET');

export const removeCoupon = (couponId) =>
    fetchRequest(`coupon/${couponId}`, 'DELETE');

export const createCoupon = (data) =>
    fetchRequest('coupon', 'POST', null, data);

// Product API
export const createProduct = (data, token) =>
    fetchRequest('product', 'POST', token, data);


export const getProductByCount = (count) =>
    fetchRequest(`products/${count}`, 'GET');

export const getProducts = (data) =>
    fetchRequest('products', 'POST', null, data);

export const getRemoveOrUpdateCountProduct = (productId, data,token) =>
    fetchRequest(`product/${productId}`, 'PUT', token, data);

export const getUpdateCountProduct = (productId) =>
    fetchRequest(`product/${productId}`, 'GET');

export const productStar = (productId, star, token) =>
    fetchRequest(`/product/star/${productId}`,'PUT',token,{ star })


export const createPaymentIntent = (data) =>
    fetchRequest('create-payment-intent', 'POST', null, data);

// image Upload
export const uploadImage = (data, token) =>
    fetchRequest('uploadimages', 'POST', token, data);

export const removeImage = (imageId, token) =>
    fetchRequest(`removeimage/${imageId}`, 'DELETE', token);
