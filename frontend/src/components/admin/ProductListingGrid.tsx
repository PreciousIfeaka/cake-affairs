import { useState } from 'react';
import { deleteProduct } from '../../services/api';
import { Product } from '../../types';

interface ProductListingGridProps {
  products: Product[];
  onRefresh: () => void;
  onEdit: (product: Product) => void;
  onView: (product: Product) => void;
}

export default function ProductListingGrid({ products, onRefresh, onEdit, onView }: ProductListingGridProps) {
  const [deletingId, setDeletingId] = useState<string | null>(null);

  async function handleDelete(id: string, name: string) {
    if (!window.confirm(`Remove "${name}" from your collection?`)) return;
    setDeletingId(id);
    try {
      await deleteProduct(id);
      onRefresh();
    } catch (e) {
      alert('Failed to delete product.');
    } finally {
      setDeletingId(null);
    }
  }

  if (!products.length) {
    return (
      <div style={{ textAlign: 'center', padding: 48, color: 'var(--color-secondary)' }}>
        <span className="material-symbols-outlined" style={{ fontSize: 48, color: 'var(--color-outline)', display: 'block' }}>inventory_2</span>
        <p className="body-md" style={{ marginTop: 8 }}>No products yet. Add your first masterpiece above.</p>
      </div>
    );
  }

  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: 'var(--spacing-gutter)' }}>
      {products.map(product => (
        <div key={product.id} className="product-card" onClick={() => onView(product)} style={{
          opacity: deletingId === product.id ? 0 : 1,
          transform: deletingId === product.id ? 'scale(0.9)' : 'none',
          transition: 'opacity 0.3s, transform 0.3s',
          cursor: 'pointer'
        }}>
          <div style={{ height: 224, overflow: 'hidden', position: 'relative' }}>
            {product.video_url ? (
              <video src={product.video_url} style={{ width: '100%', height: '100%', objectFit: 'cover' }} muted loop autoPlay playsInline />
            ) : product.image_url ? (
              <img src={product.image_url} alt={product.name} style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.5s' }}
                onMouseEnter={e => (e.currentTarget as HTMLImageElement).style.transform = 'scale(1.1)'}
                onMouseLeave={e => (e.currentTarget as HTMLImageElement).style.transform = 'scale(1)'}
              />
            ) : (
              <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: 'var(--color-surface-container)' }}>
                <span className="material-symbols-outlined" style={{ fontSize: 48, color: 'var(--color-outline)' }}>cake</span>
              </div>
            )}
            {product.badge && (
              <div style={{ position: 'absolute', top: 12, left: 12, backgroundColor: 'var(--color-tertiary)', color: 'var(--color-on-tertiary)', padding: '3px 10px', borderRadius: 'var(--radius-full)' }}>
                <span className="label-sm">{product.badge}</span>
              </div>
            )}
          </div>
          <div style={{ padding: 20 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
              <h3 className="label-md" style={{ color: 'var(--color-primary)' }}>{product.name}</h3>
              <span style={{ color: 'var(--color-primary)', fontWeight: 700, fontSize: 15 }}>₦{Number(product.price).toLocaleString()}</span>
            </div>
            <p className="label-sm" style={{ color: 'var(--color-secondary)', marginBottom: 16, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
              {product.description || product.category}
            </p>
            <div style={{ display: 'flex', gap: 8, paddingTop: 12, borderTop: '1px solid rgba(212,195,191,0.2)' }}>
              <button
                onClick={e => { e.stopPropagation(); onEdit(product); }}
                className="btn-secondary"
                style={{ flex: 1, fontSize: 12 }}
              >
                Edit
              </button>
              <button
                onClick={e => { e.stopPropagation(); handleDelete(product.id, product.name); }}
                style={{ padding: '8px 12px', backgroundColor: 'transparent', border: 'none', cursor: 'pointer', color: 'var(--color-error)', borderRadius: 'var(--radius-lg)', display: 'flex', alignItems: 'center' }}
              >
                <span className="material-symbols-outlined" style={{ fontSize: 18 }}>delete</span>
              </button>
            </div>
          </div>
        </div>
      ))}

      {/* Add placeholder */}
      <button
        onClick={() => {
          window.scrollTo({ top: 0, behavior: 'smooth' });
          setTimeout(() => {
            document.getElementById('name')?.focus();
          }, 400);
        }}
        style={{
          border: '2px dashed var(--color-outline-variant)', borderRadius: 'var(--radius-xl)',
          display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
          padding: 32, cursor: 'pointer', background: 'none',
          transition: 'background 0.2s',
        }}
        onMouseEnter={e => e.currentTarget.style.background = 'rgba(236,224,220,0.2)'}
        onMouseLeave={e => e.currentTarget.style.background = 'none'}
      >
        <div style={{ width: 48, height: 48, borderRadius: 'var(--radius-full)', backgroundColor: 'var(--color-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 12, boxShadow: 'var(--shadow-sm)' }}>
          <span className="material-symbols-outlined" style={{ color: 'var(--color-on-primary)' }}>add</span>
        </div>
        <p className="label-md" style={{ color: 'var(--color-primary)' }}>New Masterpiece</p>
        <p className="label-sm" style={{ color: 'var(--color-secondary)', textAlign: 'center', marginTop: 4 }}>Add a new creation</p>
      </button>
    </div>
  );
}
