import CitizenSidebar from "../../../components/citizen/CitizenSidebar";

const TrackComplaints = () => {
    return (
        <div className="flex min-h-screen bg-slate-50">
            <CitizenSidebar />

            <main className="flex-1 p-8">
                <h1 className="text-3xl font-bold text-slate-900">
                    Track Complaints
                </h1>

                <p className="mt-2 text-slate-600">
                    Track the status of your complaints.
                </p>
            </main>
        </div>
    );
};

export default TrackComplaints;