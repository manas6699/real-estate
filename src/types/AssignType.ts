 type Assign = {
    _id: string;
    lead_id: string;
    assignee_id: string;
    dumb_id: string;
    assignee_name: string;
    status: string;
    assign_mode: string;
    remarks: string;
    history: string[];
    lead_details: {
        name: string;
        email: string;
        phone: string;
        source: string;
        projectSource: string;
        status: string;
        comments: string,
        location: string,
        alternate_phone: string,
        client_budget: string,
        furnished_status: string,
        interested_project: string,
        lead_status: string,
        lead_type: string;
        preferred_configuration: string,
        preferred_floor: string,
        property_status: string,
        createdAt: string;
        updatedAt: string;
        subdisposition: string;
    };
    createdAt: string;
};

export default Assign