import React, { useMemo, useState } from "react";
import { clientAxios } from "../api/api";

export default function Form({ products, onCreated, onCancel }) {

    const [customerName, setCustomerName] = useState("");
    const [items, setItems] = useState([{ productId: "", quantity: 1 }]);
    const [error, setError] = useState("");
    const [saving, setSaving] = useState(false);

    const total = useMemo(() => {
        return items.reduce((sum, item) => {
            const product = products.find((p) => p.id === Number(item.productId));
            return sum + (product ? product.price * Number(item.quantity || 0) : 0);
        }, 0);
    }, [items, products]);

    const updateItem = (index, field, value) => {
        setItems((current) =>
            current.map((item, i) =>
                i === index ? { ...item, [field]: value } : item
            )
        );
    };

    const addItem = () => {
        setItems((current) => [...current, { productId: "", quantity: 1 }]);
    };

    const removeItem = (index) => {
        setItems((current) => current.filter((_, i) => i !== index));
    };

    const submit = async (e) => {
        e.preventDefault();
        setError("");

        if (!customerName.trim()) {
            setError("Customer name is required.");
            return;
        }

        if (items.some((x) => !x.productId || Number(x.quantity) <= 0)) {
            setError("Select a product and enter a valid quantity for every item.");
            return;
        }

        if (new Set(items.map((x) => Number(x.productId))).size !== items.length) {
            setError("A product can only be added once. Change the quantity instead.");
            return;
        }

        try {
            setSaving(true);

            await clientAxios.post("/bill", {
                customerName: customerName.trim(),
                items: items.map((x) => ({
                    productId: Number(x.productId),
                    quantity: Number(x.quantity),
                })),
            });

            await onCreated();
            onCancel();
        } catch (err) {
            setError(err.response?.data?.message || "Could not create the bill.");
        } finally {
            setSaving(false);
        }
    };

    return (
        <div className="card shadow-sm border-0">
            <div className="card-body">
                <h4 className="mb-4">Create New Bill</h4>

                {error && <div className="alert alert-danger">{error}</div>}

                <form onSubmit={submit}>
                    <label className="form-label">Customer Name</label>
                    <input
                        value={customerName}
                        onChange={(e) => setCustomerName(e.target.value)}
                        className="form-control mb-3"
                        placeholder="Customer name"
                    />

                    {items.map((item, index) => {
                        const selected = products.find(
                            (p) => p.id === Number(item.productId)
                        );

                        return (
                            <div className="row g-2 mb-2" key={index}>
                                <div className="col-md-6">
                                    <select
                                        className="form-select"
                                        value={item.productId}
                                        onChange={(e) =>
                                            updateItem(index, "productId", e.target.value)
                                        }
                                    >
                                        <option value="">Select product</option>
                                        {products.map((product) => (
                                            <option key={product.id} value={product.id}>
                                                {product.name} — ${product.price.toFixed(2)}
                                                {" "}({product.stockQuantity} in stock)
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                <div className="col-md-3">
                                    <input
                                        type="number"
                                        min="1"
                                        max={selected?.stockQuantity || undefined}
                                        className="form-control"
                                        value={item.quantity}
                                        onChange={(e) =>
                                            updateItem(index, "quantity", e.target.value)
                                        }
                                    />
                                </div>

                                <div className="col-md-3">
                                    <button
                                        type="button"
                                        className="btn btn-outline-danger w-100"
                                        disabled={items.length === 1}
                                        onClick={() => removeItem(index)}
                                    >
                                        Remove
                                    </button>
                                </div>
                            </div>
                        );
                    })}

                    <button type="button" className="btn btn-outline-secondary mt-2" onClick={addItem}>
                        + Add Product
                    </button>

                    <div className="d-flex justify-content-between align-items-center mt-4">
                        <strong>Total: ${total.toFixed(2)}</strong>

                        <div>
                            <button type="button" className="btn btn-light me-2" onClick={onCancel}>
                                Cancel
                            </button>
                            <button disabled={saving} type="submit" className="btn btn-success">
                                {saving ? "Saving..." : "Create Bill"}
                            </button>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    );
}
