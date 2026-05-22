// src/components/FarmerAnalyticsWidget.tsx
// Add this anywhere in FarmerDashboard.tsx:  <FarmerAnalyticsWidget />

import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { getFarmerAnalytics } from "../utils/api";
import type { FarmerAnalytics } from "../types";

export default function FarmerAnalyticsWidget() {
  const { token } = useAuth();
  const [data, setData] = useState<FarmerAnalytics | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!token) {
      setError("Not authenticated");
      setLoading(false);
      return;
    }
    getFarmerAnalytics(token)
      .then(setData)
      .catch((e: Error) => setError(e.message))
      .finally(() => setLoading(false));
  }, [token]);

  if (loading) return <div style={styles.card}><p style={styles.muted}>Loading analytics…</p></div>;
  if (error) return <div style={styles.card}><p style={styles.error}>⚠️ {error}</p></div>;
  if (!data) return null;

  // ── derive display values (adjust keys when you know the real shape) ────────
  const totalSales = data.total_sales ?? "—";
  const totalRevenue = data.total_revenue != null
    ? `₹${Number(data.total_revenue).toLocaleString("en-IN")}`
    : "—";
  const lowStock = data.low_stock_alerts ?? [];

  return (
    <div style={styles.wrapper}>
      <h3 style={styles.heading}>📊 Sales Analytics</h3>

      {/* KPI row */}
      <div style={styles.kpiRow}>
        <div style={styles.kpiCard}>
          <span style={styles.kpiLabel}>Total Sales</span>
          <span style={styles.kpiValue}>{String(totalSales)}</span>
        </div>
        <div style={styles.kpiCard}>
          <span style={styles.kpiLabel}>Total Revenue</span>
          <span style={{ ...styles.kpiValue, color: "#16a34a" }}>
            {totalRevenue}
          </span>
        </div>
        <div style={styles.kpiCard}>
          <span style={styles.kpiLabel}>Low Stock Items</span>
          <span
            style={{
              ...styles.kpiValue,
              color: lowStock.length > 0 ? "#dc2626" : "#16a34a",
            }}
          >
            {lowStock.length}
          </span>
        </div>
      </div>

      {/* Low stock alerts */}
      {lowStock.length > 0 && (
        <div style={styles.alertBox}>
          <p style={styles.alertTitle}>⚠️ Low Stock Alerts</p>
          <ul style={styles.alertList}>
            {lowStock.map((item: any) => (
              <li key={item.product_id} style={styles.alertItem}>
                <span style={styles.alertName}>{item.product_name}</span>
                <span style={styles.alertBadge}>
                  {item.stock} left
                </span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Raw fallback if API returns unexpected shape */}
      {!data.total_sales && !data.total_revenue && data.raw && (
        <pre style={styles.raw}>{String(data.raw)}</pre>
      )}
    </div>
  );
}

const styles: Record<string, React.CSSProperties> = {
  wrapper: {
    background: "#fff",
    borderRadius: 14,
    border: "1px solid #e5e7eb",
    padding: 24,
    marginBottom: 28,
  },
  heading: {
    fontSize: 18,
    fontWeight: 700,
    color: "#111827",
    margin: "0 0 18px",
  },
  kpiRow: {
    display: "flex",
    gap: 14,
    flexWrap: "wrap",
    marginBottom: 20,
  },
  kpiCard: {
    flex: "1 1 140px",
    background: "#f9fafb",
    borderRadius: 10,
    padding: "14px 18px",
    display: "flex",
    flexDirection: "column",
    gap: 4,
    border: "1px solid #f3f4f6",
  },
  kpiLabel: {
    fontSize: 12,
    fontWeight: 600,
    color: "#9ca3af",
    textTransform: "uppercase",
    letterSpacing: "0.06em",
  },
  kpiValue: {
    fontSize: 26,
    fontWeight: 800,
    color: "#111827",
    lineHeight: 1.2,
  },
  alertBox: {
    background: "#fef2f2",
    border: "1px solid #fecaca",
    borderRadius: 10,
    padding: 16,
  },
  alertTitle: {
    fontWeight: 700,
    color: "#991b1b",
    margin: "0 0 10px",
    fontSize: 14,
  },
  alertList: {
    listStyle: "none",
    margin: 0,
    padding: 0,
    display: "flex",
    flexDirection: "column",
    gap: 6,
  },
  alertItem: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    fontSize: 14,
  },
  alertName: {
    color: "#374151",
    fontWeight: 500,
  },
  alertBadge: {
    background: "#dc2626",
    color: "#fff",
    fontSize: 12,
    fontWeight: 700,
    padding: "2px 10px",
    borderRadius: 999,
  },
  raw: {
    background: "#f3f4f6",
    borderRadius: 8,
    padding: 12,
    fontSize: 12,
    color: "#374151",
    overflowX: "auto",
    margin: 0,
  },
  card: { padding: 16 },
  muted: { color: "#9ca3af", fontSize: 14 },
  error: { color: "#dc2626", fontSize: 14 },
};
