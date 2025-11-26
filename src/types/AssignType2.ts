type HistoryEntry = {
    lead_id: string;
    assignee_name: string;
    updatedAt: string;
    status: string;
    remarks: string;
};

type Assign2 = {
    _id: string;
    lead_id: string;
    assignee_id: string;
    assignee_name: string;
    status: string;
    remarks: string;
    dumb_id: string;
    history: (HistoryEntry | string)[];
    lead_details: {
        name: string;
        email: string;
        phone: string;
        source: string;
        projectSource: string;
        status: string;
        lead_status: string;
        upload_type: string,
        upload_by: string,
        comments: string;
        lead_type?: string;
        client_budget?: string;
        location?: string;
        preferred_configuration?: string;
        subdisposition?: string;
        sub_disposition?: string;
        createdAt: string;
        updatedAt: string;
    };
    createdAt: string;
    updatedAt: string;
};

export default Assign2;