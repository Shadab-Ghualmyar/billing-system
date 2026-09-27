import React, { useState } from "react";
import { clientAxios } from "../api/api";

const emptyForm = { name: "", price: "", stockQuantity: "" };

export default function Products({ products, onRefresh }) {
    const [form, setForm] = useState(emptyForm);
    const [editingId, setEditingId] = useState(null);
    const [error, setError] = useState("");

    const submit = async (e) => {
        e.preventDefault();
        setError("");

        try {
            const payload = {
                name: form.name.trim(),
                price: Number(form.price),
                stockQuantity: Number(form.stockQuantity),
            };

            if (editingId) {
                await clientAxios.put(`/product/${editingId}`, payload);
            } else {
                await clientAxios.post("/product", payload);
            }

            setForm(emptyForm);
            setEditingId(null);
            await onRefresh();
        } catch (err) {
            setError(err.response?.data?.message || "Could not save product.");
        }
    };

    const edit = (product) => {
        setEditingId(product.id);
        setForm({
            name: product.name,
            price: product.price,
            stockQuantity: product.stockQuantity,
        });
    };

    const remove = async (id) => {
        if (!window.confirm("Delete this product?")) return;

        try {
            await clientAxios.delete(`/product/${id}`);
            await onRefresh();
        } catch (err) {
            setError(err.response?.data?.message || "Could not delete product.");
        }
    };

    return (
        <div className="row g-4">
            <div className="col-lg-4">
                <div className="card shadow-sm border-0">
                    <div className="card-body">
                        <h4>{editingId ? "Edit Product" : "Add Product"}</h4>
                        {error && <div className="alert alert-danger">{error}</div>}

                        <form onSubmit={submit}>
                            <label className="form-label">Name</label>
                            <input
                                required
                                className="form-control mb-3"
                                value={form.name}
                                onChange={(e) => setForm({ ...form, name: e.target.value })}
                            />

                            <label className="form-label">Price</label>
                            <input
                                required
                                min="0.01"
                                step="0.01"
                                type="number"
                                className="form-control mb-3"
                                value={form.price}
                                onChange={(e) => setForm({ ...form, price: e.target.value })}
                            />

                            <label className="form-label">Stock Quantity</label>
                            <input
                                required
                                min="0"
                                type="number"
                                className="form-control mb-3"
                                value={form.stockQuantity}
                                onChange={(e) =>
                                    setForm({ ...form, stockQuantity: e.target.value })
                                }
                            />

                            <button className="btn btn-primary me-2">
                                {editingId ? "Update" : "Add Product"}
                            </button>

                            {editingId && (
                                <button
                                    type="button"
                                    className="btn btn-light"
                                    onClick={() => {
                                        setEditingId(null);
                                        setForm(emptyForm);
                                    }}
                                >
                                    Cancel
                                </button>
                            )}
                        </form>
                    </div>
                </div>
            </div>

            <div className="col-lg-8">
                <div className="card shadow-sm border-0">
                    <div className="card-body">
                        <h4 className="mb-3">Products & Stock</h4>

                        <div className="table-responsive">
                            <table className="table align-middle">
                                <thead>
                                    <tr>
                                        <th>Name</th>
                                        <th>Price</th>
                                        <th>Stock</th>
                                        <th className="text-end">Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {products.map((product) => (
                                        <tr key={product.id}>
                                            <td>{product.name}</td>
                                            <td>${product.price.toFixed(2)}</td>
                                            <td>
                                                <span className={`badge ${product.stockQuantity === 0 ? "text-bg-danger" : "text-bg-success"}`}>
                                                    {product.stockQuantity}
                                                </span>
                                            </td>
                                            <td className="text-end">
                                                <button
                                                    className="btn btn-sm btn-outline-primary me-2"
                                                    onClick={() => edit(product)}
                                                >
                                                    Edit
                                                </button>
                                                <button
                                                    className="btn btn-sm btn-outline-danger"
                                                    onClick={() => remove(product.id)}
                                                >
                                                    Delete
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
