"use client";
import { useDistributionOOSStore } from "../../stores/distributionStore";
import { useState } from "react";

export default function RequestsPage() {
  const {
    changeRequests,
    products,
    distributors,
    submitChangeRequest,
    runFullAnalysis,
  } = useDistributionOOSStore();
  const [form, setForm] = useState({
    distributorId: "",
    productId: "",
    fromQuantity: 0,
    toQuantity: 0,
    reason: "",
    priority: "medium",
  });
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    submitChangeRequest({
      distributorId: form.distributorId,
      originalOrder: [
        {
          productId: form.productId,
          quantity: form.fromQuantity,
          unitPrice: products.find((p) => p.id === form.productId)?.unitCost || 0,
          scheduledDelivery: new Date(Date.now() + 86400000),
        },
      ],
      requestedChanges: [
        {
          type: "increase",
          productId: form.productId,
          fromQuantity: form.fromQuantity,
          toQuantity: form.toQuantity,
          reason: form.reason,
        },
      ],
      requestText: form.reason,
      interpretedRequest: {
        confidence: 1,
        extractedChanges: [
          {
            type: "increase",
            productId: form.productId,
            fromQuantity: form.fromQuantity,
            toQuantity: form.toQuantity,
            reason: form.reason,
          },
        ],
        urgencyLevel: form.priority as "critical" | "high" | "medium" | "low",
        businessReason: form.reason,
        estimatedImpact: { revenue: 0, volume: 0, customerSatisfaction: 0 },
        keyTerms: [],
      },
      priority: form.priority as "critical" | "high" | "medium" | "low",
      deadline: new Date(Date.now() + 86400000),
      reason: form.reason,
      requestSource: "portal",
    });
    setForm({ distributorId: "", productId: "", fromQuantity: 0, toQuantity: 0, reason: "", priority: "medium" });
    setSubmitting(false);
  };

  return (
    <div className="max-w-3xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Change Requests</h1>
      <form onSubmit={handleSubmit} className="mb-8 bg-white rounded shadow p-4 flex flex-col gap-2">
        <div>
          <label className="block font-medium">Distributor</label>
          <select
            className="border rounded p-2 w-full"
            value={form.distributorId}
            onChange={(e) => setForm((f) => ({ ...f, distributorId: e.target.value }))}
            required
          >
            <option value="">Select distributor</option>
            {distributors.map((d) => (
              <option key={d.id} value={d.id}>
                {d.name}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="block font-medium">Product</label>
          <select
            className="border rounded p-2 w-full"
            value={form.productId}
            onChange={(e) => setForm((f) => ({ ...f, productId: e.target.value }))}
            required
          >
            <option value="">Select product</option>
            {products.map((p) => (
              <option key={p.id} value={p.id}>
                {p.name}
              </option>
            ))}
          </select>
        </div>
        <div className="flex gap-2">
          <div className="flex-1">
            <label className="block font-medium">Current Qty</label>
            <input
              type="number"
              className="border rounded p-2 w-full"
              value={form.fromQuantity}
              min={0}
              onChange={(e) => setForm((f) => ({ ...f, fromQuantity: Number(e.target.value) }))}
              required
            />
          </div>
          <div className="flex-1">
            <label className="block font-medium">Requested Qty</label>
            <input
              type="number"
              className="border rounded p-2 w-full"
              value={form.toQuantity}
              min={0}
              onChange={(e) => setForm((f) => ({ ...f, toQuantity: Number(e.target.value) }))}
              required
            />
          </div>
        </div>
        <div>
          <label className="block font-medium">Reason</label>
          <input
            className="border rounded p-2 w-full"
            value={form.reason}
            onChange={(e) => setForm((f) => ({ ...f, reason: e.target.value }))}
            required
          />
        </div>
        <div>
          <label className="block font-medium">Priority</label>
          <select
            className="border rounded p-2 w-full"
            value={form.priority}
            onChange={(e) => setForm((f) => ({ ...f, priority: e.target.value }))}
          >
            <option value="critical">Critical</option>
            <option value="high">High</option>
            <option value="medium">Medium</option>
            <option value="low">Low</option>
          </select>
        </div>
        <button
          type="submit"
          className="bg-blue-600 text-white rounded px-4 py-2 mt-2 disabled:opacity-50"
          disabled={submitting}
        >
          Submit Request
        </button>
      </form>
      <h2 className="text-xl font-semibold mb-2">All Requests</h2>
      <div className="space-y-4">
        {changeRequests.length === 0 && <div className="text-gray-500">No requests yet.</div>}
        {changeRequests.map((req) => (
          <div key={req.id} className="border rounded p-4 bg-gray-50">
            <div className="font-bold">{distributors.find((d) => d.id === req.distributorId)?.name}</div>
            <div className="text-sm text-gray-600">{products.find((p) => p.id === req.requestedChanges[0].productId)?.name}</div>
            <div className="text-sm">From: {req.requestedChanges[0].fromQuantity} → To: {req.requestedChanges[0].toQuantity}</div>
            <div className="text-sm">Priority: {req.priority}</div>
            <div className="text-sm">Status: <span className="font-semibold">{req.status}</span></div>
            <div className="text-sm">Reason: {req.reason}</div>
            <div className="flex gap-2 mt-2">
              <button
                className="bg-green-600 text-white rounded px-3 py-1 text-sm disabled:opacity-50"
                disabled={req.status === "approved"}
                onClick={() => runFullAnalysis(req.id)}
              >
                Evaluate
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
