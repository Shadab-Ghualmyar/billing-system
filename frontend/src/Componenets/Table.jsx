import React from "react";
import { clientAxios } from "../api/api";

export default function Table({ data, onRefresh, onOpenBill, onNewBill }) {
    const deleteBill = async (id) => {
        if (!window.confirm("Delete this bill? Product stock will be returned.")) return;

        try {
            await clientAxios.delete(`/bill/${id}`);
            await onRefresh();
        } catch {
            alert("Could not delete the bill.");
        }
    };

    return (
        <div className="card shadow-sm border-0">
            <div className="card-body">
                <div className="d-flex justify-content-between align-items-center mb-3">
                    <h4 className="mb-0">Bills</h4>
                    <button className="btn btn-primary" onClick={onNewBill}>Create Bill</button>
                </div>

                <div className="table-responsive">
                    <table className="table table-hover align-middle">
                        <thead>
                            <tr>
                                <th>#</th>
                                <th>Customer</th>
                                <th>Date</th>
                                <th>Items</th>
                                <th>Total</th>
                                <th className="text-end">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {data.length === 0 ? (
                                <tr><td colSpan="6" className="text-center text-muted py-4">No bills found.</td></tr>
                            ) : data.map((bill) => (
                                <tr key={bill.id}>
                                    <td>#{bill.id}</td>
                                    <td>{bill.customerName}</td>
                                    <td>{new Date(bill.createdAt).toLocaleString()}</td>
                                    <td>{bill.items.length}</td>
                                    <td>${Number(bill.totalAmount).toFixed(2)}</td>
                                    <td className="text-end">
                                        <button className="btn btn-sm btn-outline-primary me-2" onClick={() => onOpenBill(bill.id)}>Details</button>
                                        <button className="btn btn-sm btn-outline-danger" onClick={() => deleteBill(bill.id)}>Delete</button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
