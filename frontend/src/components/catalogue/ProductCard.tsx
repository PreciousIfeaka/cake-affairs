import { Product } from '../../types';

interface ProductCardProps {
  product: Product;
  whatsappNumber: string;
  onSelect: (product: Product) => void;
}

export default function ProductCard({ product, whatsappNumber, onSelect }: ProductCardProps) {
  const whatsappMessage = encodeURIComponent(
    `Hi! I'd like to order "${product.name}" (₦${Number(product.price).toLocaleString()}). Please let me know availability.`
  );
  const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${whatsappMessage}`;

  return (
    <div
      className="product-card"
      onClick={() => onSelect(product)}
      style={{ display: 'flex', flexDirection: 'column', height: '100%', cursor: 'pointer' }}
    >
      {/* Image / Video container matching admin grid layout */}
      <div style={{ height: 224, overflow: 'hidden', position: 'relative' }}>
        {product.video_url ? (
          <video
            src={product.video_url}
            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
            muted
            loop
            autoPlay
            playsInline
          />
        ) : product.image_url ? (
          <img
            src={product.image_url}
            alt={product.name}
            loading="lazy"
            style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.5s' }}
            onMouseEnter={e => (e.currentTarget as HTMLImageElement).style.transform = 'scale(1.1)'}
            onMouseLeave={e => (e.currentTarget as HTMLImageElement).style.transform = 'scale(1)'}
          />
        ) : (
          <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: 'var(--color-surface-container)' }}>
            <span className="material-symbols-outlined" style={{ fontSize: 48, color: 'var(--color-outline)' }}>cake</span>
          </div>
        )}
        
        {/* Badge */}
        {product.badge && (
          <div style={{
            position: 'absolute',
            top: 12,
            left: 12,
            backgroundColor: 'var(--color-tertiary)',
            color: 'var(--color-on-tertiary)',
            padding: '3px 10px',
            borderRadius: 'var(--radius-full)'
          }}>
            <span className="label-sm" style={{ fontWeight: 700, fontSize: 10 }}>
              {product.badge.toUpperCase()}
            </span>
          </div>
        )}
      </div>

      {/* Details container matching admin padding and structure */}
      <div style={{ padding: 20, display: 'flex', flexDirection: 'column', flex: 1 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8, gap: 8 }}>
          <h3 className="label-md" style={{ color: 'var(--color-primary)', margin: 0 }}>
            {product.name}
          </h3>
          <span style={{ color: 'var(--color-primary)', fontWeight: 700, fontSize: 15, whiteSpace: 'nowrap' }}>
            ₦{Number(product.price).toLocaleString()}
          </span>
        </div>
        
        <p className="label-sm" style={{
          color: 'var(--color-secondary)',
          marginBottom: 16,
          display: '-webkit-box',
          WebkitLineClamp: 2,
          WebkitBoxOrient: 'vertical',
          overflow: 'hidden',
          height: 36,
          minHeight: 36
        }}>
          {product.description || product.category}
        </p>

        {/* Action Button Row at bottom */}
        <div style={{ display: 'flex', gap: 8, paddingTop: 12, borderTop: '1px solid rgba(212,195,191,0.2)', marginTop: 'auto' }}>
          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            onClick={e => e.stopPropagation()}
            className="btn-primary"
            style={{
              width: '100%',
              textDecoration: 'none',
              justifyContent: 'center',
              fontSize: 12,
              padding: '8px 16px',
              borderRadius: 'var(--radius-full)',
              display: 'flex',
              alignItems: 'center',
              gap: 4
            }}
          >
            <span className="material-symbols-outlined" style={{ fontSize: 16 }}>chat</span>
            Order Now
          </a>
        </div>
      </div>
    </div>
  );
}
