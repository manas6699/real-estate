
import {
    getCoreRowModel,
    useReactTable,
    ColumnDef,
} from '@tanstack/react-table';
import {  useRouter } from 'next/navigation';

type Assign = {
    _id: string;
    lead_id: string;
    assignee_id: string;
    assignee_name: string;
    status: string;
    remarks: string;
    history: string[];
    lead_details: {
        name: string;
        email: string;
        phone: string;
        source: string;
        status: string;
        createdAt: string;
        updatedAt: string;
    };
};

interface Props {
    data: Assign[];
}

export default function AssignedLeads({ data }: Props) {
    const router = useRouter();

    const columns: ColumnDef<Assign>[] = [
        {
            accessorKey: 'lead_details.name',
            header: 'Customer Name',
        },
    ];

    const table = useReactTable({
        data,
        columns,
        getCoreRowModel: getCoreRowModel(),
    });


    return (
        <div className="space-y-4 relative">
            {/* Header */}
            <div className='flex'>
                <h1 className="text-2xl font-bold mb-4">All Leads</h1>
                <div className="bg-black rounded-full h-8 ml-2.5 w-8">
                    <span className="text-white text-xs font-extrabold flex items-center justify-center h-full">
                        {data.length}
                    </span>
                </div>
            </div>

            {/* Cards */}
            {table.getRowModel().rows.map(row => {
                const lead = row.original.lead_details;
                const assign = row.original;

                return (
                    <div
                        key={row.id}
                        className="bg-white rounded-2xl shadow p-6 flex flex-col space-y-4"
                    >
                        {/* ✅ First row */}
                        <div className="flex flex-wrap justify-between gap-10">
                            <div className="flex flex-col text-xs text-gray-500">
                                <span className="font-medium text-black">Project Name</span>
                                <span>{lead.source}</span>
                            </div>
                            <div className="flex flex-col text-xs text-gray-500">
                                <span className="font-medium text-black">Customer Name</span>
                                <span>{lead.name}</span>
                            </div>
                            <div className="flex flex-col text-xs text-gray-500">
                                <span className="font-medium text-black">Remarks</span>
                                <span>{assign.remarks}</span>
                            </div>
                            <div className="flex flex-col text-xs text-gray-500">
                                <span className="font-medium text-black">Assigned Date</span>
                                <span>
                                    {new Date(lead.createdAt).toLocaleDateString('en-GB', {
                                        day: 'numeric',
                                        month: 'long',
                                        year: 'numeric',
                                    })}
                                </span>
                            </div>
                            <div className="flex flex-col text-xs text-gray-500">
                                <span className="font-medium text-black">Phone</span>
                                <span>{lead.phone}</span>
                            </div>
                        </div>

                        {/* ✅ Second row */}
                        <div className="flex flex-wrap justify-between gap-4">
                            <div className="flex flex-col text-xs text-gray-500">
                                <span className="font-medium text-black">Client Email</span>
                                <span>{lead.email}</span>
                            </div>

                            <div className="flex flex-col text-xs text-gray-500">
                                <span className="font-medium text-black">Lead Source</span>
                                <span>{lead.source}</span>
                            </div>
                            
                            <div className="flex items-center">
                                <span className="bg-yellow-200 text-xs px-3 py-1 rounded-md text-blue-600 font-medium">
                                    {lead.status} 
                                </span>
                            </div>
                            
                            <button
                                className="px-2 rounded bg-black cursor-pointer border"
                                onClick={() => router.push(`/telecaller/change/${assign.lead_id}`)}
                            >
                                <span className="text-xs text-white">Fill Details</span>
                            </button>

                        </div>
                    </div>
                );
            })}

        </div>
    );
}
