import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import {
  Package, Truck, CheckCircle2, Clock, XCircle,
  MapPin, CreditCard, ChevronRight, ArrowLeft,
  ShoppingBag, RotateCcw,
} from 'lucide-react';
import { ordersApi, parseOrderAmount, ORDER_STATUS_LABEL } from '../utils/api';
import type { ApiOrder, OrderStatus } from '../utils/api';

// ── Status config ──────────────────────────────────────────────────
const STATUS_STEPS: OrderStatus[] = [
  'PENDING', 'CONFIRMED', 'PROCESSING', 'SHIPPED', 'OUT_FOR_DELIVERY', 'DELIVERED',
];

const STATUS_META: Record<OrderStatus, {
  icon: React.ElementType;
  color: string;
  bg: string;
  border: string;
  label: string;
}> = {
  PENDING:          { icon: Clock,        color: 'text-amber',      bg: 'bg-amber/10',      border: 'border-amber/30',      label: 'Order Placed'       },
  CONFIRMED:        { icon: CheckCircle2, color: 'text-info',       bg: 'bg-info/10',       border: 'border-info/30',       label: 'Confirmed'          },
  PROCESSING:       { icon: RotateCcw,    color: 'text-sage',       bg: 'bg-sage/10',       border: 'border-sage/30',       label: 'Being Prepared'     },
  SHIPPED:          { icon: Truck,        color: 'text-info',       bg: 'bg-info/10',       border: 'border-info/30',       label: 'Shipped'            },
  OUT_FOR_DELIVERY: { icon: MapPin,       color: 'text-terracotta', bg: 'bg-terracotta/10', border: 'border-terracotta/30', label: 'Out for Delivery'   },
  DELIVERED:        { icon: Package,      color: 'text-sage-dark',  bg: 'bg-sage/10',       border: 'border-sage/30',       label: 'Delivered'          },
  CANCELLED:        { icon: XCircle,      color: 'text-danger',     bg: 'bg-danger/5',      border: 'border-danger/20',     label: 'Cancelled'          },
};

// ── Helpers ────────────────────────────────────────────────────────
function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('en-IN', {
    day: 'numeric', month: 'short', year: 'numeric',
    hour: '2-digit', minute: '2-digit',
  });
}

function formatCurrency(val: string | number) {
  const n = typeof val === 'string' ? parseOrderAmount(val) : val;
  return new Intl.NumberFormat('en-IN', {
    style: 'currency', currency: 'INR', maximumFractionDigits: 2,
  }).format(n);
}

// ── Progress bar ───────────────────────────────────────────────────
function ProgressStepper({ status }: { status: OrderStatus }) {
  if (status === 'CANCELLED') return null;
  const current = STATUS_STEPS.indexOf(status);

  return (
    <div className="bg-white rounded-2xl p-6 shadow-xs border border-border">
      <h3 className="font-heading text-base font-semibold text-black mb-6">
        Order Progress
      </h3>

      {/* Desktop: horizontal */}
      <div className="hidden sm:flex items-center">
        {STATUS_STEPS.map((step, i) => {
          const done    = i <= current;
          const active  = i === current;
          const meta    = STATUS_META[step];
          const Icon    = meta.icon;

          return (
            <div key={step} className="flex items-center flex-1 last:flex-none">
              <div className="flex flex-col items-center gap-2">
                <div className={`
                  w-10 h-10 rounded-xl flex items-center justify-center border-2 transition-all
                  ${active  ? `${meta.bg} ${meta.border} shadow-md scale-110` : ''}
                  ${done && !active ? `${meta.bg} ${meta.border}` : ''}
                  ${!done ? 'bg-offwhite border-border' : ''}
                `}>
                  <Icon className={`w-5 h-5 ${done ? meta.color : 'text-muted'}`} />
                </div>
                <span className={`text-[11px] font-medium text-center leading-tight max-w-[64px] ${
                  active ? `${meta.color} font-semibold` : done ? 'text-dark' : 'text-muted'
                }`}>
                  {meta.label}
                </span>
              </div>
              {i < STATUS_STEPS.length - 1 && (
                <div className={`
                  flex-1 h-1 mx-2 rounded-full transition-all
                  ${i < current ? 'bg-sage' : 'bg-border'}
                `} />
              )}
            </div>
          );
        })}
      </div>

      {/* Mobile: vertical */}
      <div className="flex sm:hidden flex-col gap-0">
        {STATUS_STEPS.map((step, i) => {
          const done   = i <= current;
          const active = i === current;
          const meta   = STATUS_META[step];
          const Icon   = meta.icon;

          return (
            <div key={step} className="flex gap-3">
              <div className="flex flex-col items-center">
                <div className={`
                  w-9 h-9 rounded-xl flex items-center justify-center border-2 flex-shrink-0 transition-all
                  ${active  ? `${meta.bg} ${meta.border} shadow-sm` : ''}
                  ${done && !active ? `${meta.bg} ${meta.border}` : ''}
                  ${!done ? 'bg-offwhite border-border' : ''}
                `}>
                  <Icon className={`w-4 h-4 ${done ? meta.color : 'text-muted'}`} />
                </div>
                {i < STATUS_STEPS.length - 1 && (
                  <div className={`w-0.5 flex-1 my-1 rounded-full ${i < current ? 'bg-sage' : 'bg-border'}`} />
                )}
              </div>
              <div className="pb-4 pt-1">
                <p className={`text-sm font-semibold ${active ? meta.color : done ? 'text-dark' : 'text-muted'}`}>
                  {meta.label}
                </p>
                {active && (
                  <p className="text-xs text-muted mt-0.5">Current status</p>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ── Status history timeline ────────────────────────────────────────
function StatusTimeline({ history }: { history: ApiOrder['status_history'] }) {
  if (!history?.length) return null;
  const sorted = [...history].sort(
    (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
  );

  return (
    <div className="bg-white rounded-2xl p-6 shadow-xs border border-border">
      <h3 className="font-heading text-base font-semibold text-black mb-4 flex items-center gap-2">
        <Clock className="w-4 h-4 text-muted" /> Status History
      </h3>
      <div className="flex flex-col gap-0">
        {sorted.map((h, i) => {
          const meta = STATUS_META[h.status];
          const Icon = meta.icon;
          return (
            <div key={h.history_id} className="flex gap-3">
              <div className="flex flex-col items-center">
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${meta.bg} ${meta.border} border`}>
                  <Icon className={`w-4 h-4 ${meta.color}`} />
                </div>
                {i < sorted.length - 1 && (
                  <div className="w-0.5 flex-1 bg-border my-1" />
                )}
              </div>
              <div className="pb-4 pt-1 flex-1">
                <div className="flex items-center justify-between gap-2 flex-wrap">
                  <p className="text-sm font-semibold text-dark">
                    {ORDER_STATUS_LABEL[h.status]}
                  </p>
                  <p className="text-xs text-muted">{formatDate(h.created_at)}</p>
                </div>
                {h.comments && (
                  <p className="text-xs text-muted mt-0.5">{h.comments}</p>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ── Skeleton loader ────────────────────────────────────────────────
function Skeleton() {
  return (
    <div className="space-y-4 animate-pulse">
      {[80, 200, 160, 120].map((h, i) => (
        <div key={i} className="bg-white rounded-2xl border border-border" style={{ height: h }} />
      ))}
    </div>
  );
}

// ── UUID input form (for manual lookup) ───────────────────────────
function UuidForm({ onSubmit }: { onSubmit: (uuid: string) => void }) {
  const [val, setVal] = useState('');
  return (
    <div className="bg-white rounded-2xl p-8 shadow-xs border border-border text-center max-w-md mx-auto">
      <div className="w-16 h-16 bg-info/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
        <Package className="w-8 h-8 text-info" />
      </div>
      <h2 className="font-heading text-xl font-bold text-black mb-2">Track Your Order</h2>
      <p className="text-muted text-sm mb-6">Enter your order tracking ID to see real-time status.</p>
      <input
        type="text"
        value={val}
        onChange={(e) => setVal(e.target.value)}
        onKeyDown={(e) => e.key === 'Enter' && val.trim() && onSubmit(val.trim())}
        placeholder="e.g. 3fa85f64-5717-4562-b3fc-2c963f66afa6"
        className="w-full px-4 py-3 bg-offwhite border border-border rounded-xl text-sm font-mono focus:border-info focus:ring-2 focus:ring-info/15 outline-none mb-3"
      />
      <button
        onClick={() => val.trim() && onSubmit(val.trim())}
        disabled={!val.trim()}
        className="w-full py-3 bg-info text-white font-semibold rounded-xl hover:bg-info/90 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
      >
        Track Order
      </button>
    </div>
  );
}

// ── Main page ─────────────────────────────────────────────────────
export default function OrderTrackingPage() {
  const { uuid }      = useParams<{ uuid: string }>();
  const navigate      = useNavigate();
  const { t }         = useTranslation();

  const [order, setOrder]     = useState<ApiOrder | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState<string | null>(null);
  const [searchUuid, setSearchUuid] = useState(uuid ?? '');

  const fetchOrder = (id: string) => {
    setLoading(true);
    setError(null);
    setOrder(null);
    ordersApi
      .getByUuid(id)
      .then(setOrder)
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    if (uuid) fetchOrder(uuid);
  }, [uuid]);

  const handleFormSubmit = (id: string) => {
    setSearchUuid(id);
    navigate(`/orders/${id}`);
    fetchOrder(id);
  };

  const statusMeta = order ? STATUS_META[order.current_status] : null;
  const StatusIcon = statusMeta?.icon ?? Package;

  return (
    <div className="min-h-screen bg-offwhite pt-24 pb-16">
      <div className="max-w-2xl mx-auto px-4 md:px-8">

        {/* Back nav */}
        <div className="flex items-center gap-2 mb-6">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-1.5 text-sm text-muted hover:text-dark transition-colors"
          >
            <ArrowLeft className="w-4 h-4" /> Back
          </button>
          <ChevronRight className="w-3.5 h-3.5 text-muted" />
          <span className="text-sm text-dark font-medium">Order Tracking</span>
        </div>

        {/* Page title */}
        <div className="mb-8">
          <h1 className="font-heading text-2xl md:text-3xl font-bold text-black">
            {t('orderTracking.title', 'Track Order')}
          </h1>
          {order && (
            <p className="text-muted text-sm mt-1 font-mono">
              #{order.order_uuid}
            </p>
          )}
        </div>

        {/* No UUID in URL → show input form */}
        {!uuid && !searchUuid && (
          <UuidForm onSubmit={handleFormSubmit} />
        )}

        {/* Loading */}
        {loading && <Skeleton />}

        {/* Error */}
        {error && (
          <div className="space-y-4">
            <div className="bg-danger/5 border border-danger/20 rounded-2xl p-6 flex items-start gap-4">
              <XCircle className="w-6 h-6 text-danger flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold text-danger text-sm">Order not found</p>
                <p className="text-muted text-sm mt-1">{error}</p>
              </div>
            </div>
            <UuidForm onSubmit={handleFormSubmit} />
          </div>
        )}

        {/* Order loaded */}
        {order && !loading && (
          <div className="space-y-4 animate-fade-in">

            {/* Hero status card */}
            <div className={`rounded-2xl p-6 border-2 ${statusMeta?.bg} ${statusMeta?.border}`}>
              <div className="flex items-center gap-4">
                <div className={`w-14 h-14 rounded-2xl flex items-center justify-center bg-white shadow-sm`}>
                  <StatusIcon className={`w-7 h-7 ${statusMeta?.color}`} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-semibold text-muted uppercase tracking-wider mb-1">
                    Current Status
                  </p>
                  <h2 className={`font-heading text-2xl font-bold ${statusMeta?.color}`}>
                    {ORDER_STATUS_LABEL[order.current_status]}
                  </h2>
                  <p className="text-sm text-muted mt-0.5">
                    Placed {formatDate(order.created_at)}
                  </p>
                </div>
                <div className="text-right flex-shrink-0">
                  <p className="text-xs text-muted mb-1">Total</p>
                  <p className="font-heading text-xl font-bold text-black">
                    {formatCurrency(order.total_amount)}
                  </p>
                </div>
              </div>
            </div>

            {/* Progress stepper */}
            <ProgressStepper status={order.current_status} />

            {/* Order items */}
            <div className="bg-white rounded-2xl p-6 shadow-xs border border-border">
              <h3 className="font-heading text-base font-semibold text-black mb-4 flex items-center gap-2">
                <ShoppingBag className="w-4 h-4 text-muted" />
                Items ({order.items.length})
              </h3>
              <div className="space-y-3">
                {order.items.map((item) => (
                  <div
                    key={item.order_item_id}
                    className="flex items-center justify-between p-4 bg-offwhite rounded-xl gap-3"
                  >
                    <div className="w-10 h-10 bg-sage/10 rounded-xl flex items-center justify-center flex-shrink-0">
                      <Package className="w-5 h-5 text-sage" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-dark truncate">
                        Product #{item.product_id}
                      </p>
                      <p className="text-xs text-muted">
                        Qty: {item.quantity} · Seller #{item.seller_id}
                      </p>
                    </div>
                    <p className="text-sm font-bold text-black flex-shrink-0">
                      {formatCurrency(item.price_at_purchase)}
                    </p>
                  </div>
                ))}
              </div>

              {/* Total row */}
              <div className="flex items-center justify-between mt-4 pt-4 border-t border-border">
                <p className="text-sm font-semibold text-dark">Order Total</p>
                <p className="font-heading text-lg font-bold text-black">
                  {formatCurrency(order.total_amount)}
                </p>
              </div>
            </div>

            {/* Payment info */}
            {order.payment && (
              <div className="bg-white rounded-2xl p-6 shadow-xs border border-border">
                <h3 className="font-heading text-base font-semibold text-black mb-4 flex items-center gap-2">
                  <CreditCard className="w-4 h-4 text-muted" /> Payment
                </h3>
                <div className="grid grid-cols-2 gap-3">
                  {[
                    { label: 'Method',  value: order.payment.payment_method || '—' },
                    { label: 'Amount',  value: formatCurrency(order.payment.amount) },
                    { label: 'Status',  value: order.payment.status },
                    { label: 'Txn ID',  value: order.payment.transaction_id || '—' },
                  ].map(({ label, value }) => (
                    <div key={label} className="bg-offwhite rounded-xl p-3">
                      <p className="text-xs text-muted mb-1">{label}</p>
                      <p className="text-sm font-semibold text-dark truncate">{value}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Status timeline */}
            <StatusTimeline history={order.status_history} />

            {/* Footer actions */}
            <div className="flex gap-3 pt-2">
              <Link
                to="/orders"
                className="flex-1 py-3 text-center text-sm font-semibold rounded-xl border border-border text-dark hover:bg-light transition-colors"
              >
                All Orders
              </Link>
              <Link
                to="/marketplace"
                className="flex-1 py-3 text-center text-sm font-semibold rounded-xl bg-info text-white hover:bg-info/90 transition-colors"
              >
                Shop Again
              </Link>
            </div>

          </div>
        )}
      </div>
    </div>
  );
}
