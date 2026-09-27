import React, { useEffect, useState } from "react";
import { clientAxios } from "../api/api";

export default function Bill({ id, onRefresh, onBack }) {
    const [bill, setBill] = useState(null);
    const [error, setError] = useState("");

    const loadBill = async () => {
        try {
            const response = await clientAxios.get(`/bill/${id}`);
            setBill(response.data);
        } catch {
            setError("Bill not found.");
        }
    };

    useEffect(() => {
        loadBill();
    }, [id]);

    const deleteBill = async () => {
        if (!window.confirm("Delete this bill?")) return;

        try {
            await clientAxios.delete(`/bill/${id}`);
            await onRefresh();
            onBack();
        } catch {
            setError("Could not delete the bill.");
        }
    };

    if (error) return <div className="alert alert-danger">{error}</div>;
    if (!bill) return <div className="text-center">Loading...</div>;

    return (
        <div className="card shadow-sm border-0">
            <div className="card-body p-4">
                <div className="d-flex justify-content-between align-items-start mb-4">
                    <div>
                        <h3>Invoice #{bill.id}</h3>
                        <div>Customer: <strong>{bill.customerName}</strong></div>
                        <div className="text-muted">{new Date(bill.createdAt).toLocaleString()}</div>
                    </div>
                    <div>
                        <button className="btn btn-outline-danger me-2" onClick={deleteBill}>Delete</button>
                        <button className="btn btn-light" onClick={onBack}>Back</button>
                    </div>
                </div>

                <table className="table">
                    <thead>
                        <tr><th>Product</th><th>Quantity</th><th>Unit Price</th><th className="text-end">Total</th></tr>
                    </thead>
                    <tbody>
                        {bill.items.map((item) => (
                            <tr key={item.id}>
                                <td>{item.productName}</td>
                                <td>{item.quantity}</td>
                                <td>${Number(item.unitPrice).toFixed(2)}</td>
                                <td className="text-end">${Number(item.total).toFixed(2)}</td>
                            </tr>
                        ))}
                    </tbody>
                    <tfoot>
                        <tr><th colSpan="3" className="text-end">Grand Total</th><th className="text-end">${Number(bill.totalAmount).toFixed(2)}</th></tr>
                    </tfoot>
                </table>
            </div>
        </div>
    );
}
