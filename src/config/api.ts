export const API_BASE_URL = 'https://split-wise-clone-085p.onrender.com/api';
// export const API_BASE_URL = 'http://localhost:8000/api';


export const LEADS_ENDPOINT = `${API_BASE_URL}/mmr/leads`;
export const GET_ALL_LEADS = `${API_BASE_URL}/mmr/getallleads`;


export const BACKEND_ADMIN_POST_API = `${API_BASE_URL}/mmr`;
export const UPLOAD_IMAGES_BASE_URL = `${API_BASE_URL}/mmr/uploads`;


export const SHOW_ALL_USERS_API = `${API_BASE_URL}/show/allUsers`;

export const SHOW_ALL_ASSIGNS_API = `${API_BASE_URL}/admin/all/assigns`;

export const ASSIGN_API = `${API_BASE_URL}/admin/assign`;

export const WEB_SOCKET_URL = `${API_BASE_URL.replace('/api', '')}`;

export const GET_ALL_TELECALLERS_API = `${API_BASE_URL}/users/telecallers`;

export const GET_ALL_SALES_PERSONS_API = `${API_BASE_URL}/users/salespersons`;

export const CREATE_CAMPAIGN = `${API_BASE_URL}/create/campaigns`;

export const GET_LEAD_BY_ID = (id: string) => `${API_BASE_URL}/admin/assigns/${id}`;

export const GET_LEAD_BY_TELECALLER_ID = (id: string) => `${API_BASE_URL}/mmr/getlead/${id}`;

export const EDIT_LEAD_FORM = (id: string) => `${API_BASE_URL}/mmr/leads/${id}`;

export const POST_FCM_TOKEN = `${API_BASE_URL}/push-notifications/save-token`;