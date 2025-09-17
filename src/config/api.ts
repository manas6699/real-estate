
// export const API_BASE_URL = 'https://split-wise-clone-085p.onrender.com/api';
// export const API_BASE_URL = 'http://localhost:8000/api';

export const API_BASE_URL = 'https://mmrrealty.co.in/api';


export const LEADS_ENDPOINT = `${API_BASE_URL}/mmr/leads`;
export const GET_ALL_LEADS = `${API_BASE_URL}/mmr/getallleads`;

export const GET_ALL_UNASSIGNED_LEADS = `${API_BASE_URL}/mmr/getallleads?status=not-assigned`
export const BACKEND_ADMIN_POST_API = `${API_BASE_URL}/mmr`;
export const UPLOAD_IMAGES_BASE_URL = `${API_BASE_URL}/mmr/uploads`;


export const SHOW_ALL_USERS_API = `${API_BASE_URL}/show/allUsers`;

export const SHOW_ALL_ASSIGNS_API = `${API_BASE_URL}/admin/all/assigns`;

export const ASSIGN_API = `${API_BASE_URL}/admin/assign`;
export const BULK_ASSIGN_API = `${API_BASE_URL}/admin/bulk/assign`
export const WEB_SOCKET_URL = `${API_BASE_URL.replace('/api', '')}`;

export const GET_ALL_TELECALLERS_API = `${API_BASE_URL}/users/telecallers`;

export const GET_ALL_SALES_PERSONS_API = `${API_BASE_URL}/users/salespersons`;

export const CREATE_CAMPAIGN = `${API_BASE_URL}/create/campaigns`;

export const GET_LEAD_BY_ID = (id: string) => `${API_BASE_URL}/admin/assigns/${id}`;

export const GET_LEAD_BY_TELECALLER_ID = (id: string) => `${API_BASE_URL}/mmr/getlead/${id}`;

// it handles the fixcard data don't touch it again
export const GET_LEAD_DETAILS = (id: string) => `${API_BASE_URL}/mmr/getleadDetails/${id}`;

// Get multiple lead details
export const GET_MULTIPLE_LEAD_DETAILS = `${API_BASE_URL}/mmr/get/multipleLeadDetails`
// Get multiple assign details
export const GET_MULTIPLE_ASSIGNS = `${API_BASE_URL}/admin/getAll/assigns`

export const EDIT_LEAD_FORM = (id: string) => `${API_BASE_URL}/mmr/leads/${id}`;

export const POST_FCM_TOKEN = `${API_BASE_URL}/push-notifications/save-token`;

export const GET_SCHEDULES_BY_ID = (id: string) => `${API_BASE_URL}/calender/schedules/${id}`;

export const GET_ALL_SCHEDULES = `${API_BASE_URL}/calender/allSchedules`;

// get lead history
export const GET_LEAD_HISTORY = (id: string) => `${API_BASE_URL}/admin/assigns/history/${id}`;

// fetch filtered data
export const GET_FILTERED_DATA = `${API_BASE_URL}/admin/all/assigns`

export const GET_OLD_LEADS_FOR_ADMIN = `${API_BASE_URL}/admin/oL`

export const GET_OLD_LEADS_FOR_TELECALLER = `${API_BASE_URL}/admin/telecaller`

// assign old leads
export const ASSIGN_OLD_LEADS_TO_TELECALLER = `${API_BASE_URL}/admin/assign/old/to/telecaller`

// reassign new leads
export const REASSIGN_NEW_LEADS = `${API_BASE_URL}/admin/reassign`

// stat count 
export const ALL_LEAD_COUNT = `${API_BASE_URL}/admin/count`

// post a project
export const POST_A_PROJECT = `${API_BASE_URL}/post/addproject/projectName`
// get all projects
export const GET_ALL_PROJECTS = `${API_BASE_URL}/post/addproject/projectName`
// post a location
export const POST_A_LOCATION = `${API_BASE_URL}/locations/name`
// get all locations
export const GET_ALL_LOCATIONS = `${API_BASE_URL}/locations/name`
// post a source
export const  POST_A_SOURCE = `${API_BASE_URL}/sources/source`

// get all sources
export const GET_ALL_SOURCES = `${API_BASE_URL}/sources/source`

// for reassign 
export const REASSIGN_API = `${API_BASE_URL}/admin/reassign`

// for bulk upload
export const BULK_UPLOAD_API = `${API_BASE_URL}/upload/bulk`