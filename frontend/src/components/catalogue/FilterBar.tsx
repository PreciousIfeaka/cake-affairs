import { useState } from 'react';
import { Filters, CategoryInfo } from '../../types';

interface FilterBarProps {
  categories: CategoryInfo[];
  filters: Filters;
  onFilterChange: (newFilters: Filters) => void;
}

export default function FilterBar({ categories, filters, onFilterChange }: FilterBarProps) {
  const [open, setOpen] = useState(false);

  return (
    <div style={{ marginBottom: 24 }}>
      {/* Search input */}
      <div style={{ display: 'flex', gap: 12, alignItems: 'center', marginBottom: 16 }}>
        <div style={{ position: 'relative', flex: 1 }}>
          <span className="material-symbols-outlined" style={{
            position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)',
            color: 'var(--color-outline)', fontSize: 20, pointerEvents: 'none'
          }}>search</span>
          <input
            className="input-field"
            style={{ paddingLeft: 44 }}
            type="text"
            placeholder="Search cakes..."
            value={filters.search || ''}
            onChange={e => onFilterChange({ search: e.target.value })}
          />
        </div>
        <button
          className="btn-secondary"
          style={{ display: 'flex', alignItems: 'center', gap: 6, whiteSpace: 'nowrap' }}
          onClick={() => setOpen(!open)}
        >
          <span className="material-symbols-outlined" style={{ fontSize: 18 }}>tune</span>
          Filters
        </button>
      </div>

      {/* Expandable filter panel */}
      {open && (
        <div style={{
          background: 'var(--color-surface-container-low)',
          borderRadius: 'var(--radius-lg)',
          padding: 20,
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: 16,
          marginBottom: 16,
          boxShadow: 'var(--shadow-sm)',
        }}>
          {/* Category filter */}
          <div>
            <label className="label-md" style={{ display: 'block', marginBottom: 8, color: 'var(--color-on-surface-variant)' }}>
              Category
            </label>
            <select
              className="input-field"
              value={filters.category || ''}
              onChange={e => onFilterChange({ category: e.target.value || undefined })}
            >
              <option value="">All Categories</option>
              {categories.map(cat => (
                <option key={cat.category_slug} value={cat.category_slug}>{cat.category}</option>
              ))}
            </select>
          </div>

          {/* Price range */}
          <div>
            <label className="label-md" style={{ display: 'block', marginBottom: 8, color: 'var(--color-on-surface-variant)' }}>
              Min Price (₦)
            </label>
            <input
              className="input-field"
              type="number" min="0"
              placeholder="0"
              value={filters.minPrice || ''}
              onChange={e => onFilterChange({ minPrice: e.target.value || undefined })}
            />
          </div>
          <div>
            <label className="label-md" style={{ display: 'block', marginBottom: 8, color: 'var(--color-on-surface-variant)' }}>
              Max Price (₦)
            </label>
            <input
              className="input-field"
              type="number" min="0"
              placeholder="Any"
              value={filters.maxPrice || ''}
              onChange={e => onFilterChange({ maxPrice: e.target.value || undefined })}
            />
          </div>

          {/* Clear filters */}
          <div style={{ display: 'flex', alignItems: 'flex-end' }}>
            <button
              className="btn-secondary"
              style={{ width: '100%' }}
              onClick={() => onFilterChange({ category: undefined, minPrice: undefined, maxPrice: undefined, search: undefined })}
            >
              Clear Filters
            </button>
          </div>
        </div>
      )}

      {/* Active category chips */}
      <div style={{ display: 'flex', gap: 8, overflowX: 'auto', paddingBottom: 4 }} className="no-scrollbar">
        <button
          onClick={() => onFilterChange({ category: undefined })}
          style={{
            padding: '6px 16px', borderRadius: 'var(--radius-full)',
            border: 'none', cursor: 'pointer', whiteSpace: 'nowrap',
            backgroundColor: !filters.category ? 'var(--color-primary)' : 'var(--color-secondary-container)',
            color: !filters.category ? 'var(--color-on-primary)' : 'var(--color-on-secondary-container)',
            fontFamily: 'Plus Jakarta Sans', fontSize: 12, fontWeight: 600,
            transition: 'all 0.2s',
          }}
        >
          All
        </button>
        {categories.map(cat => (
          <button
            key={cat.category_slug}
            onClick={() => onFilterChange({ category: cat.category_slug })}
            style={{
              padding: '6px 16px', borderRadius: 'var(--radius-full)',
              border: 'none', cursor: 'pointer', whiteSpace: 'nowrap',
              backgroundColor: filters.category === cat.category_slug ? 'var(--color-primary)' : 'var(--color-secondary-container)',
              color: filters.category === cat.category_slug ? 'var(--color-on-primary)' : 'var(--color-on-secondary-container)',
              fontFamily: 'Plus Jakarta Sans', fontSize: 12, fontWeight: 600,
              transition: 'all 0.2s',
            }}
          >
            {cat.category}
          </button>
        ))}
      </div>
    </div>
  );
}
