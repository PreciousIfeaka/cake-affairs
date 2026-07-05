import { useState, useEffect } from 'react';
import Header from '../components/common/Header';
import FilterBar from '../components/catalogue/FilterBar';
import ProductCard from '../components/catalogue/ProductCard';
import ProductDetailModal from '../components/catalogue/ProductDetailModal';
import { useProducts } from '../hooks/useProducts';
import { getSetting, getCategorySamples } from '../services/api';
import { Filters, CategorySample, Product } from '../types';

export default function CataloguePage() {
  const [filters, setFilters] = useState<Filters>({});
  const [whatsappNumber, setWhatsappNumber] = useState<string>('');
  const [galleryImageUrl, setGalleryImageUrl] = useState<string>('');
  const [categorySamples, setCategorySamples] = useState<CategorySample[]>([]);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const { products, categories, loading, error } = useProducts(filters);

  useEffect(() => {
    getSetting('whatsapp_number')
      .then(res => setWhatsappNumber(res.data.value))
      .catch(() => {});
    getSetting('gallery_image_url')
      .then(res => setGalleryImageUrl(res.data.value))
      .catch(() => {});
    getCategorySamples()
      .then(res => setCategorySamples(res.data))
      .catch(() => {});
  }, []);

  function handleFilterChange(newFilters: Filters) {
    setFilters(prev => {
      const merged: Filters = { ...prev, ...newFilters };
      Object.keys(merged).forEach(k => {
        if (merged[k as keyof Filters] === undefined) {
          delete merged[k as keyof Filters];
        }
      });
      return merged;
    });
  }

  function handleCategoryClick(cat: string) {
    setFilters({ category: cat });
    document.getElementById('daily-selection')?.scrollIntoView({ behavior: 'smooth' });
  }

  return (
    <>
      <Header />
      <main style={{ paddingTop: 112 }}>

        {/* Hero / Gallery Banner */}
        <section style={{ padding: '0 var(--spacing-margin-mobile)', marginTop: 8 }}>
          <div style={{
            position: 'relative',
            borderRadius: 'var(--radius-xl)',
            overflow: 'hidden',
            maxHeight: 260,
            minHeight: 180,
            boxShadow: 'var(--shadow-md)',
          }}>
            {/* Background image or colour fallback */}
            <div style={{
              position: 'absolute', inset: 0,
              backgroundImage: galleryImageUrl ? `url(${galleryImageUrl})` : undefined,
              backgroundColor: galleryImageUrl ? undefined : 'var(--color-primary-container)',
              backgroundSize: 'cover',
              backgroundPosition: 'center',
            }} />

            {/* Gradient overlay */}
            <div style={{
              position: 'absolute', inset: 0,
              background: 'linear-gradient(to bottom, rgba(54,31,26,0) 0%, rgba(54,31,26,0.65) 100%)',
            }} />

            {/* Content */}
            <div style={{
              position: 'relative', display: 'flex', flexDirection: 'column',
              alignItems: 'center', justifyContent: 'center',
              padding: '40px 32px', textAlign: 'center', minHeight: 180,
            }}>
              <h2 className="display-lg-mobile" style={{ color: 'white', marginBottom: 8, fontSize: 28 }}>Cakes Gallery</h2>
              <p className="body-md" style={{ color: 'rgba(255,255,255,0.85)', marginBottom: 20, maxWidth: 280 }}>
                Make your choice of the best cakes you want.
              </p>
              <a
                href={`https://wa.me/${whatsappNumber}`}
                target="_blank" rel="noopener noreferrer"
                className="btn-primary"
                style={{ textDecoration: 'none', borderRadius: 'var(--radius-full)', padding: '12px 32px' }}
              >
                Order Now
              </a>
            </div>
          </div>
        </section>

        {/* Our Special Cake Samples */}
        {categorySamples.length > 0 && (
          <section style={{ marginTop: 20, paddingLeft: 'var(--spacing-margin-mobile)' }}>
            <h3 className="headline-sm" style={{ color: 'var(--color-primary)', marginBottom: 16, paddingRight: 'var(--spacing-margin-mobile)' }}>
              Our Special Cake Samples
            </h3>
            <div style={{
              display: 'flex', gap: 16, overflowX: 'auto', paddingBottom: 12,
              paddingRight: 'var(--spacing-margin-mobile)',
            }} className="no-scrollbar">
              {categorySamples.map((sample, idx) => {
                const rotations = [6, -3, 3, -6, 4, -4];
                const rotation = rotations[idx % rotations.length];
                return (
                  <div
                    key={sample.category_slug}
                    onClick={() => handleCategoryClick(sample.category_slug)}
                    style={{ flexShrink: 0, width: 112, cursor: 'pointer' }}
                  >
                    <div style={{ position: 'relative', width: '100%', aspectRatio: '1 / 1', marginBottom: 8 }}>
                      {/* Background ring */}
                      <div style={{
                        position: 'absolute', inset: 0,
                        backgroundColor: 'var(--color-secondary-container)',
                        borderRadius: '50%',
                        transform: `rotate(${rotation}deg)`,
                        transition: 'transform 0.2s',
                      }} />
                      {/* Image circle */}
                      <div style={{
                        position: 'relative', width: '100%', height: '100%',
                        borderRadius: '50%', overflow: 'hidden',
                        border: '2px solid var(--color-primary-fixed-dim)',
                        boxShadow: '0 4px 12px rgba(54,31,26,0.1)',
                      }}>
                        <img
                          src={sample.image_url}
                          alt={sample.category}
                          loading="lazy"
                          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                        />
                      </div>
                    </div>
                    <p className="label-md" style={{
                      textAlign: 'center', color: 'var(--color-on-surface-variant)',
                      textTransform: 'capitalize',
                    }}>
                      {sample.category}
                    </p>
                  </div>
                );
              })}
            </div>
          </section>
        )}

        {/* Filter Bar */}
        <section style={{ padding: '20px var(--spacing-margin-mobile) 0' }}>
          <FilterBar
            categories={categories}
            filters={filters}
            onFilterChange={handleFilterChange}
          />
        </section>

        {/* Product Grid */}
        <section id="daily-selection" style={{ padding: '0 var(--spacing-margin-mobile)', marginTop: 8 }}>
          <h3 className="headline-sm" style={{ color: 'var(--color-primary)', marginBottom: 20 }}>
            {Object.keys(filters).length > 0 ? 'Search Results' : 'Daily Selection'}
          </h3>

          {loading && (
            <div style={{ textAlign: 'center', padding: 48, color: 'var(--color-secondary)' }}>
              <span className="material-symbols-outlined" style={{ fontSize: 40, animation: 'spin 1s linear infinite' }}>refresh</span>
              <p className="body-md" style={{ marginTop: 8 }}>Loading delicious cakes...</p>
            </div>
          )}

          {error && (
            <div style={{ textAlign: 'center', padding: 48, color: 'var(--color-error)' }}>
              <span className="material-symbols-outlined" style={{ fontSize: 40 }}>error</span>
              <p className="body-md" style={{ marginTop: 8 }}>{error}</p>
            </div>
          )}

          {!loading && !error && products.length === 0 && (
            <div style={{ textAlign: 'center', padding: 48, color: 'var(--color-secondary)' }}>
              <span className="material-symbols-outlined" style={{ fontSize: 48, color: 'var(--color-outline)' }}>cake</span>
              <p className="body-md" style={{ marginTop: 8 }}>No cakes found. Try a different filter.</p>
            </div>
          )}

          {!loading && !error && products.length > 0 && (
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))',
              gap: 'var(--spacing-gutter)',
            }}>
              {products.map(product => (
                <ProductCard
                  key={product.id}
                  product={product}
                  whatsappNumber={whatsappNumber}
                  onSelect={setSelectedProduct}
                />
              ))}
            </div>
          )}
        </section>

        {/* Brand CTA */}
        <section style={{ padding: '32px var(--spacing-margin-mobile) 80px' }}>
          <div style={{
            backgroundColor: 'var(--color-primary-container)',
            borderRadius: 'var(--radius-xl)',
            padding: 32,
            textAlign: 'center',
          }}>
            <span className="material-symbols-outlined" style={{ fontSize: 48, color: 'var(--color-primary-fixed-dim)', display: 'block', marginBottom: 16 }}>bakery_dining</span>
            <h3 className="headline-sm" style={{ color: 'white', marginBottom: 8 }}>Baked with Love</h3>
            <p className="body-md" style={{ color: 'var(--color-on-primary-container)', marginBottom: 24 }}>
              Reach out via WhatsApp for custom orders, seasonal specials, and more.
            </p>
            <a
              href={`https://wa.me/${whatsappNumber}`}
              target="_blank" rel="noopener noreferrer"
              className="btn-primary"
              style={{ display: 'inline-flex', textDecoration: 'none', textTransform: 'uppercase', letterSpacing: '0.1em' }}
            >
              Make Order
            </a>
          </div>
        </section>

      </main>

      {selectedProduct && (
        <ProductDetailModal
          product={selectedProduct}
          whatsappNumber={whatsappNumber}
          onClose={() => setSelectedProduct(null)}
        />
      )}
    </>
  );
}
