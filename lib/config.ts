export const API_CONFIG = {
  BASE_URL: "https://mera.dubaivisionhub.com/api",
  UPLOADS_URL: "https://mera.dubaivisionhub.com",
} as const

export const api = {
  // Auth endpoints
  adminLogin: `${API_CONFIG.BASE_URL}/admin/login`,

  // Resource endpoints
  users: `${API_CONFIG.BASE_URL}/users`,
  categories: `${API_CONFIG.BASE_URL}/categories`,
  menu: `${API_CONFIG.BASE_URL}/menu`,
  orders: `${API_CONFIG.BASE_URL}/orders`,
  paymentMethods: `${API_CONFIG.BASE_URL}/payment-methods`,

  // Upload endpoints
  menuUpload: `${API_CONFIG.BASE_URL}/menu/upload`,

  // Dynamic endpoints
  category: (id: string) => `${API_CONFIG.BASE_URL}/categories/${id}`,
  menuItem: (id: string) => `${API_CONFIG.BASE_URL}/menu/${id}`,
  orderStatus: (id: string) => `${API_CONFIG.BASE_URL}/orders/${id}/status`,
  paymentMethod: (id: string) => `${API_CONFIG.BASE_URL}/payment-methods/${id}`,

  // Image URL helper
  image: (path: string) => `${API_CONFIG.UPLOADS_URL}${path}`,
}
