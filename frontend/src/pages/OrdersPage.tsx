import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { ordersApi, parseOrderAmount, ORDER_STATUS_LABEL } from '../utils/api';
import type { ApiOrder, OrderStatus } from '../utils/api';

// ── Status config ──────────────────────────────────────────────────
const STATUS_STEPS: OrderStatus[] = [
  'PENDING',
  'CONFIRMED',
  'PROCESSING',
  'SHIPPED',
  'OUT_FOR_DELIVERY',
  'DELIVERED',
];

const STATUS_META: Record<
  OrderStatus,
  { color: string; bg: string; icon: string }
> = {
  PENDING:          { color: '#b45309', bg: '#fef3c7', icon: '🕐' },
  CONFIRMED:        { color: '#0369a1', bg: '#e0f2fe', icon: '✅' },
  PROCESSING:       { color: '#7c3aed', bg: '#ede9fe', icon: '⚙️' },
  SHIPPED:          { color: '#0891b2', bg: '#cffafe', icon: '🚚' },
  OUT_FOR_DELIVERY: { color: '#d97706', bg: '#fef9c3', icon: '📦' },
  DELIVERED:        { color: '#16a34a', bg: '#dcfce7', icon: '🌾' },
  CANCELLED:        { color: '#dc2626', bg: '#fee2e2', icon: '✕'  },
};

// ── Helpers ────────────────────────────────────────────────────────
function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('en-IN', {
    day: 'numeric', month: 'short', year: 'numeric',
  });
}

function formatCurrency(amount: string) {
  const n = parseOrderAmount(amount);
  return new Intl.NumberFormat('en-IN', {
    style: 'currency', currency: 'INR', maximumFractionDigits: 2,
  }).format(n);
}

function getStepIndex(status: OrderStatus) {
  return STATUS_STEPS.indexOf(status);
}

// ── Sub-components ────────────────────────────────────────────────

function StatusBadge({ status }: { status: OrderStatus }) {
  const meta = STATUS_META[status];
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center', gap: '4px',
      padding: '3px 10px', borderRadius: '20px', fontSize: '12px',
      fontWeight: 600, letterSpacing: '0.02em',
      color: meta.color, background: meta.bg,
    }}>
      <span style={{ fontSize: '11px' }}>{meta.icon}</span>
      {ORDER_STATUS_LABEL[status]}
    </span>
  );
}

function ProgressTracker({ status }: { status: OrderStatus }) {
  if (status === 'CANCELLED') return null;
  const current = getStepIndex(status);
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 0, margin: '16px 0 4px' }}>
      {STATUS_STEPS.map((step, i) => {
        const done = i <= current;
        const active = i === current;
        const meta = STATUS_META[step];
        return (
          <div key={step} style={{ display: 'flex', alignItems: 'center', flex: i < STATUS_STEPS.length - 1 ? 1 : 'none' }}>
            {/* dot */}
            <div title={ORDER_STATUS_LABEL[step]} style={{
              width: active ? 28 : 20,
              height: active ? 28 : 20,
              borderRadius: '50%',
              background: done ? meta.color : '#e5e7eb',
              border: active ? `3px solid ${meta.color}` : '2px solid transparent',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: active ? '13px' : '10px',
              transition: 'all 0.3s ease',
              flexShrink: 0,
              boxShadow: active ? `0 0 0 4px ${meta.bg}` : 'none',
            }}>
              {done ? (active ? meta.icon : '✓') : ''}
            </div>
            {/* line */}
            {i < STATUS_STEPS.length - 1 && (
              <div style={{
                flex: 1, height: 3, marginInline: '2px',
                background: i < current ? STATUS_META[STATUS_STEPS[i]].color : '#e5e7eb',
                borderRadius: 2, transition: 'background 0.3s ease',
              }} />
            )}
          </div>
        );
      })}
    </div>
  );
}

function OrderCard({
  order, expanded, onToggle,
}: {
  order: ApiOrder;
  expanded: boolean;
  onToggle: () => void;
}) {
  const navigate = useNavigate();
  const meta = STATUS_META[order.current_status];

  return (
    <div style={{
      background: '#fff',
      border: `1.5px solid ${expanded ? meta.color + '55' : '#e9e3d8'}`,
      borderRadius: '14px',
      overflow: 'hidden',
      transition: 'border-color 0.2s, box-shadow 0.2s',
      boxShadow: expanded ? `0 4px 24px ${meta.color}18` : '0 1px 4px rgba(0,0,0,0.06)',
    }}>
      {/* Header row */}
      <button
        onClick={onToggle}
        style={{
          width: '100%', padding: '16px 20px',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          background: 'none', border: 'none', cursor: 'pointer', textAlign: 'left',
          gap: '12px',
        }}
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', flex: 1, minWidth: 0 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
            <span style={{ fontFamily: "'Playfair Display', serif", fontSize: '15px', fontWeight: 700, color: '#1c160e' }}>
              Order #{order.order_id}
            </span>
            <StatusBadge status={order.current_status} />
          </div>
          <span style={{ fontSize: '12px', color: '#9c8c6e' }}>
            {formatDate(order.created_at)} · {order.items.length} item{order.items.length !== 1 ? 's' : ''}
          </span>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '16px', flexShrink: 0 }}>
          <span style={{
            fontFamily: "'Playfair Display', serif",
            fontSize: '17px', fontWeight: 700, color: '#2d5a27',
          }}>
            {formatCurrency(order.total_amount)}
          </span>
          <span style={{
            fontSize: '18px', color: '#9c8c6e',
            transform: expanded ? 'rotate(180deg)' : 'rotate(0deg)',
            transition: 'transform 0.25s ease', display: 'inline-block',
          }}>▾</span>
        </div>
      </button>

      {/* Expanded body */}
      {expanded && (
        <div style={{ padding: '0 20px 20px', borderTop: '1px solid #f0ebe0' }}>
          {/* Progress tracker */}
          <ProgressTracker status={order.current_status} />

          {/* Items list */}
          <div style={{ marginTop: '18px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
            <p style={{ fontSize: '12px', fontWeight: 600, color: '#9c8c6e', textTransform: 'uppercase', letterSpacing: '0.08em', margin: 0 }}>
              Items
            </p>
            {order.items.map((item) => (
              <div key={item.order_item_id} style={{
                display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                padding: '10px 14px', background: '#faf7f2', borderRadius: '8px',
              }}>
                <div>
                  <p style={{ margin: 0, fontSize: '13px', fontWeight: 600, color: '#1c160e' }}>
                    Product #{item.product_id}
                  </p>
                  <p style={{ margin: '2px 0 0', fontSize: '12px', color: '#9c8c6e' }}>
                    Qty: {item.quantity} · Seller #{item.seller_id}
                  </p>
                </div>
                <span style={{ fontSize: '14px', fontWeight: 700, color: '#2d5a27' }}>
                  {formatCurrency(item.price_at_purchase)}
                </span>
              </div>
            ))}
          </div>

          {/* Payment pill */}
          {order.payment && (
            <div style={{
              marginTop: '14px', padding: '10px 14px',
              background: '#f0fdf4', borderRadius: '8px',
              display: 'flex', justifyContent: 'space-between', alignItems: 'center',
            }}>
              <span style={{ fontSize: '12px', color: '#166534', fontWeight: 600 }}>
                💳 {order.payment.payment_method || 'Payment'}
              </span>
              <span style={{
                fontSize: '11px', padding: '2px 8px', borderRadius: '12px',
                background: order.payment.status === 'PAID' ? '#dcfce7' : '#fef9c3',
                color: order.payment.status === 'PAID' ? '#166534' : '#854d0e',
                fontWeight: 600,
              }}>
                {order.payment.status}
              </span>
            </div>
          )}

          {/* Actions */}
          <div style={{ marginTop: '14px', display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
            <button
              onClick={() => navigate(`/orders/${order.order_uuid}`)}
              style={{
                padding: '8px 16px', borderRadius: '8px', fontSize: '13px', fontWeight: 600,
                border: '1.5px solid #2d5a27', color: '#2d5a27', background: 'none',
                cursor: 'pointer',
              }}
            >
              Track Order
            </button>
            {order.current_status === 'PENDING' && (
              <button
                onClick={async () => {
                  if (!confirm('Cancel this order?')) return;
                  await ordersApi.delete(order.order_id);
                  window.location.reload();
                }}
                style={{
                  padding: '8px 16px', borderRadius: '8px', fontSize: '13px', fontWeight: 600,
                  border: '1.5px solid #dc2626', color: '#dc2626', background: 'none',
                  cursor: 'pointer',
                }}
              >
                Cancel
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

// ── Empty state ───────────────────────────────────────────────────
function EmptyOrders() {
  const navigate = useNavigate();
  return (
    <div style={{
      textAlign: 'center', padding: '60px 24px',
      display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '16px',
    }}>
      <div style={{ fontSize: '56px', lineHeight: 1 }}>🌾</div>
      <p style={{ fontFamily: "'Playfair Display', serif", fontSize: '22px', fontWeight: 700, color: '#1c160e', margin: 0 }}>
        No orders yet
      </p>
      <p style={{ color: '#9c8c6e', fontSize: '14px', margin: 0, maxWidth: '280px' }}>
        Head to the marketplace and place your first order with local farmers.
      </p>
      <button
        onClick={() => navigate('/marketplace')}
        style={{
          marginTop: '8px', padding: '12px 28px',
          background: '#2d5a27', color: '#fff',
          border: 'none', borderRadius: '10px',
          fontSize: '14px', fontWeight: 600, cursor: 'pointer',
        }}
      >
        Browse Marketplace
      </button>
    </div>
  );
}

// ── Filter bar ────────────────────────────────────────────────────
const FILTER_OPTIONS: { label: string; value: OrderStatus | 'ALL' }[] = [
  { label: 'All',           value: 'ALL'           },
  { label: '🕐 Pending',    value: 'PENDING'        },
  { label: '🚚 Shipped',    value: 'SHIPPED'        },
  { label: '🌾 Delivered',  value: 'DELIVERED'      },
  { label: '✕ Cancelled',  value: 'CANCELLED'      },
];

// ── Main page ─────────────────────────────────────────────────────
export default function OrdersPage() {
  const { user } = useAuth();
  const [orders, setOrders]       = useState<ApiOrder[]>([]);
  const [loading, setLoading]     = useState(true);
  const [error, setError]         = useState<string | null>(null);
  const [filter, setFilter]       = useState<OrderStatus | 'ALL'>('ALL');
  const [expandedId, setExpandedId] = useState<number | null>(null);

  useEffect(() => {
    if (!user?.user_id) return;
    setLoading(true);
    ordersApi
      .listByBuyer(user.user_id)
      .then((data) => {
        // newest first
        setOrders(data.sort((a, b) =>
          new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
        ));
      })
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, [user?.user_id]);

  const filtered = filter === 'ALL'
    ? orders
    : orders.filter((o) => o.current_status === filter);

  return (
    <>
      {/* Google Fonts */}
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700&family=DM+Sans:wght@400;500;600&display=swap');`}</style>

      <div style={{
        minHeight: '100vh',
        background: 'linear-gradient(160deg, #fdf8f0 0%, #f5f0e8 100%)',
        fontFamily: "'DM Sans', sans-serif",
      }}>
        {/* Top stripe */}
        <div style={{
          background: 'linear-gradient(90deg, #2d5a27 0%, #3d7a35 100%)',
          height: '4px',
        }} />

        <div style={{ maxWidth: '720px', margin: '0 auto', padding: '32px 16px 64px' }}>

          {/* Page header */}
          <div style={{ marginBottom: '28px' }}>
            <h1 style={{
              fontFamily: "'Playfair Display', serif",
              fontSize: '28px', fontWeight: 700,
              color: '#1c160e', margin: '0 0 4px',
            }}>
              My Orders
            </h1>
            <p style={{ color: '#9c8c6e', fontSize: '14px', margin: 0 }}>
              {orders.length} order{orders.length !== 1 ? 's' : ''} placed
            </p>
          </div>

          {/* Filter chips */}
          {!loading && orders.length > 0 && (
            <div style={{
              display: 'flex', gap: '8px', flexWrap: 'wrap', marginBottom: '20px',
            }}>
              {FILTER_OPTIONS.map((f) => (
                <button
                  key={f.value}
                  onClick={() => setFilter(f.value)}
                  style={{
                    padding: '6px 14px', borderRadius: '20px', fontSize: '13px',
                    fontWeight: 600, cursor: 'pointer', transition: 'all 0.15s',
                    border: filter === f.value ? '1.5px solid #2d5a27' : '1.5px solid #d6cdb8',
                    background: filter === f.value ? '#2d5a27' : '#fff',
                    color: filter === f.value ? '#fff' : '#6b5c3e',
                  }}
                >
                  {f.label}
                </button>
              ))}
            </div>
          )}

          {/* States */}
          {loading && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {[1, 2, 3].map((i) => (
                <div key={i} style={{
                  height: '80px', borderRadius: '14px',
                  background: 'linear-gradient(90deg, #f0ebe0 25%, #faf7f2 50%, #f0ebe0 75%)',
                  backgroundSize: '200% 100%',
                  animation: 'shimmer 1.4s infinite',
                }} />
              ))}
              <style>{`@keyframes shimmer { 0%{background-position:200% 0} 100%{background-position:-200% 0} }`}</style>
            </div>
          )}

          {error && (
            <div style={{
              padding: '16px', background: '#fee2e2', borderRadius: '10px',
              color: '#dc2626', fontSize: '14px', fontWeight: 500,
            }}>
              ⚠️ {error}
            </div>
          )}

          {!loading && !error && orders.length === 0 && <EmptyOrders />}

          {!loading && !error && filtered.length === 0 && orders.length > 0 && (
            <div style={{ textAlign: 'center', padding: '40px', color: '#9c8c6e', fontSize: '14px' }}>
              No orders with status "{ORDER_STATUS_LABEL[filter as OrderStatus]}"
            </div>
          )}

          {/* Order cards */}
          {!loading && !error && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {filtered.map((order) => (
                <OrderCard
                  key={order.order_id}
                  order={order}
                  expanded={expandedId === order.order_id}
                  onToggle={() =>
                    setExpandedId((prev) =>
                      prev === order.order_id ? null : order.order_id
                    )
                  }
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
}