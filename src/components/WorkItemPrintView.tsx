import type { WorkItem, Order, User } from '../types'
import { STATUS_CONFIG, TYPE_CONFIG } from '../types'
import logo from '../assets/stocket_aterbruk_400px_d25943f48a.png'

interface Props {
  item: WorkItem
  order: Order | undefined
  users: User[]
  printDate: string
}

function fmt(iso: string | null): string {
  if (!iso) return '–'
  return new Intl.DateTimeFormat('sv-SE', { day: 'numeric', month: 'long', year: 'numeric' }).format(new Date(iso))
}

function fmtDate(iso: string): string {
  return new Intl.DateTimeFormat('sv-SE', { day: 'numeric', month: 'long', year: 'numeric' }).format(new Date(iso))
}

export default function WorkItemPrintView({ item, order, users, printDate }: Props) {
  const assignedNames = users.length > 0
    ? users.map(u => u.name).join(', ')
    : '–'

  const totalQty = order
    ? order.products.reduce((sum, p) => sum + p.quantity, 0)
    : 0

  return (
    <div className="print-view-container">
      {/* ── Header band ─────────────────────────────── */}
      <div className="print-header">
        <img src={logo} alt="Stocket Återbruk" />
        <span className="print-header-date">Utskrivet: {printDate}</span>
      </div>

      {/* ── Task section ────────────────────────────── */}
      <div className="print-section">
        <h2>Ärendeinformation</h2>
        <table className="print-info-table">
          <tbody>
            <tr><td>Ärende-ID</td><td>{item.id}</td></tr>
            <tr><td>Titel</td><td>{item.title}</td></tr>
            <tr><td>Typ</td><td>{TYPE_CONFIG[item.type].label}</td></tr>
            <tr><td>Status</td><td>{STATUS_CONFIG[item.status].label}</td></tr>
            <tr><td>Tilldelad</td><td>{assignedNames}</td></tr>
            <tr><td>Utförandedatum</td><td>{fmt(item.scheduledDate)}</td></tr>
            {item.reference && (
              <tr><td>Referens</td><td>{item.reference}</td></tr>
            )}
          </tbody>
        </table>

        {item.transport && (item.transport.pickupAddress || item.transport.deliveryAddress || item.transport.transportType) && (
          <>
            <h3>Transportinformation</h3>
            <table className="print-info-table">
              <tbody>
                {item.transport.pickupAddress && (
                  <tr><td>Hämtadress</td><td>{item.transport.pickupAddress}</td></tr>
                )}
                {item.transport.deliveryAddress && (
                  <tr><td>Leveransadress</td><td>{item.transport.deliveryAddress}</td></tr>
                )}
                {item.transport.transportType && (
                  <tr><td>Transporttyp</td><td>{item.transport.transportType}</td></tr>
                )}
              </tbody>
            </table>
          </>
        )}

        {item.cancellationComment && (
          <>
            <h3>Avbokningskommentar</h3>
            <div className="print-description">{item.cancellationComment}</div>
          </>
        )}

        {item.description && (
          <>
            <h3>Kommentar</h3>
            <div className="print-description">{item.description}</div>
          </>
        )}
      </div>

      {/* ── Order section (only if linked order found) ── */}
      {order && (
        <div className="print-section">
          <h2>Orderinformation – #{order.orderNumber}</h2>

          {order.products.map(product => (
            <div key={product.id} className="print-product-row">
              {/* Left: images */}
              <div className="print-product-images">
                <img
                  src={product.imageUrl}
                  alt={product.name}
                  className="print-product-main-image"
                />
                {product.thumbnailUrl && (
                  <img
                    src={product.thumbnailUrl}
                    alt={product.name}
                    className="print-product-thumb"
                  />
                )}
              </div>

              {/* Right: product details */}
              <div className="print-product-details">
                <h3>{product.name}</h3>
                <p>{product.description}</p>
                <p className="print-product-qty">
                  Antal: {product.quantity} {product.unit ?? 'st'}
                </p>
              </div>
            </div>
          ))}

          {/* Order info grid */}
          <div className="print-order-info-grid">
            <div className="print-info-block">
              <h4>Beställarinformation</h4>
              <dl>
                <dt>Ordernummer</dt>
                <dd>{order.orderNumber}</dd>
                <dt>Orderdatum</dt>
                <dd>{fmtDate(order.orderDate)}</dd>
                <dt>Beställare</dt>
                <dd>{order.customerName}</dd>
                <dt>E-post</dt>
                <dd>{order.customerEmail}</dd>
                <dt>Förvaningsbilag</dt>
                <dd>{order.storageLocation}</dd>
              </dl>
            </div>

            <div className="print-info-block">
              <h4>Leveransinformation</h4>
              <dl>
                <dt>Antal (totalt)</dt>
                <dd>{totalQty} {order.products[0]?.unit ?? 'st'}</dd>
                <dt>Avhämtas</dt>
                <dd>{fmt(order.pickupDate)}</dd>
                <dt>Lagerplats vid avhämtning</dt>
                <dd>{order.pickupStorageAddress}</dd>
                <dt>Leveransadress</dt>
                <dd>{order.deliveryAddress}</dd>
              </dl>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
