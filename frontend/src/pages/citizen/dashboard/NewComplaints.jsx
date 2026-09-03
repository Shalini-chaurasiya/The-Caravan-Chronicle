import CitizenSidebar from "../../../components/citizen/CitizenSidebar";

const NewComplaint = () => {
    return (
        <div className="flex min-h-screen bg-slate-50">
            <CitizenSidebar />

            <main className="flex-1 p-8">
                <h1 className="text-3xl font-bold text-slate-900">
                    New Complaint
                </h1>

                <p className="mt-2 text-slate-600">
                    Submit a new municipal complaint.
                </p>
            </main>
        </div>
    );
};

export default NewComplaint;