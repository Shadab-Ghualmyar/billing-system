import "./App.css";
import { useEffect, useState } from "react";
import Tab from "./Componenets/Tab";
import Table from "./Componenets/Table";
import Bill from "./Componenets/Bill";
import Form from "./Componenets/Form";
import Products from "./Componenets/Products";
import { clientAxios } from "./api/api";

function App() {
    const [page, setPage] = useState("bills");
    const [selectedBillId, setSelectedBillId] = useState(null);
    const [bills, setBills] = useState([]);
    const [products, setProducts] = useState([]);
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(true);

    const loadData = async () => {
        try {
            setLoading(true);
            setError("");
            const billsResponse = await clientAxios.get("/bill");
            const productsResponse = await clientAxios.get("/product");
            setBills(billsResponse.data);
            setProducts(productsResponse.data);
        } catch (error) {
            setError("Could not connect to the API. Make sure ASP.NET Core is running.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadData();
    }, []);

    const openBill = (id) => {
        setSelectedBillId(id);
        setPage("bill");
    };

    const goTo = (newPage) => {
        setSelectedBillId(null);
        setPage(newPage);
    };

    return (
        <div className="container py-4">
            <div className="mb-4">
                <h1 className="mb-1">Billing System</h1>
                <p className="text-muted mb-0">Manage products, stock and customer bills</p>
            </div>

            <Tab page={page} onChange={goTo} />

            {error && <div className="alert alert-danger">{error}</div>}

            {loading ? (
                <div className="text-center py-5">Loading...</div>
            ) : (
                <>
                    {page === "bills" && (
                        <Table
                            data={bills}
                            onRefresh={loadData}
                            onOpenBill={openBill}
                            onNewBill={() => goTo("form")}
                        />
                    )}

                    {page === "form" && (
                        <Form
                            products={products}
                            onCreated={loadData}
                            onCancel={() => goTo("bills")}
                        />
                    )}

                    {page === "products" && (
                        <Products products={products} onRefresh={loadData} />
                    )}

                    {page === "bill" && selectedBillId && (
                        <Bill
                            id={selectedBillId}
                            onRefresh={loadData}
                            onBack={() => goTo("bills")}
                        />
                    )}
                </>
            )}
        </div>
    );
}

export default App;
