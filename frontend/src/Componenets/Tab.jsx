import React from "react";

export default function Tab({ page, onChange }) {
    return (
        <ul className="nav nav-tabs mb-4">
            <li className="nav-item">
                <button className={`nav-link ${page === "bills" || page === "bill" ? "active" : ""}`} onClick={() => onChange("bills")}>
                    Bills
                </button>
            </li>
            <li className="nav-item">
                <button className={`nav-link ${page === "form" ? "active" : ""}`} onClick={() => onChange("form")}>
                    New Bill
                </button>
            </li>
            <li className="nav-item">
                <button className={`nav-link ${page === "products" ? "active" : ""}`} onClick={() => onChange("products")}>
                    Products
                </button>
            </li>
        </ul>
    );
}
