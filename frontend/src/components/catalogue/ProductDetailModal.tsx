import React, { useState } from 'react';
import { Product } from '../../types';

interface ProductDetailModalProps {
  product: Product;
  whatsappNumber: string;
  onClose: () => void;
}

const zoomButtonStyle: React.CSSProperties = {
  width: 36,
  height: 36,
  borderRadius: '50%',
  backgroundColor: 'rgba(255, 255, 255, 0.95)',
  border: 'none',
  cursor: 'pointer',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  boxShadow: 'var(--shadow-sm)',
  transition: 'background-color 0.2s',
};

export default function ProductDetailModal({ product, whatsappNumber, onClose }: ProductDetailModalProps) {
  const [zoom, setZoom] = useState<number>(1);
  const [position, setPosition] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const [dragStart, setDragStart] = useState<{ x: number; y: number }>({ x: 0, y: 0 });

  const whatsappMessage = encodeURIComponent(
    `Hi! I'd like to order "${product.name}" (₦${Number(product.price).toLocaleString()}). Please let me know availability.`
  );
  const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${whatsappMessage}`;

  const handleZoomIn = () => {
    setZoom(2.5);
  };

  const handleZoomOut = () => {
    setZoom(1);
    setPosition({ x: 0, y: 0 });
  };

  const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    if (zoom === 1) return;
    e.preventDefault();
    setIsDragging(true);
    setDragStart({
      x: e.clientX - position.x,
      y: e.clientY - position.y,
    });
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!isDragging || zoom === 1) return;
    e.preventDefault();
    // Cap boundaries to prevent dragging the image completely off-screen
    const nextX = e.clientX - dragStart.x;
    const nextY = e.clientY - dragStart.y;
    setPosition({ x: nextX, y: nextY });
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleTouchStart = (e: React.TouchEvent<HTMLDivElement>) => {
    if (zoom === 1) return;
    const touch = e.touches[0];
    setIsDragging(true);
    setDragStart({
      x: touch.clientX - position.x,
      y: touch.clientY - position.y,
    });
  };

  const handleTouchMove = (e: React.TouchEvent<HTMLDivElement>) => {
    if (!isDragging || zoom === 1) return;
    const touch = e.touches[0];
    const nextX = touch.clientX - dragStart.x;
    const nextY = touch.clientY - dragStart.y;
    setPosition({ x: nextX, y: nextY });
  };

  return (
    <div
      onClick={onClose}
      style={{
        position: 'fixed',
        inset: 0,
        backgroundColor: 'rgba(54,31,26,0.5)',
        backdropFilter: 'blur(8px)',
        zIndex: 100,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 20,
      }}
    >
      {/* Modal Box with Responsive Split Class */}
      <div
        onClick={e => e.stopPropagation()}
        className="product-detail-modal-grid"
        style={{
          backgroundColor: 'var(--color-background)',
          borderRadius: 'var(--radius-xl)',
          width: '100%',
          maxWidth: 860,
          maxHeight: '90vh',
          overflowY: 'auto',
          boxShadow: '0 20px 48px rgba(54,31,26,0.18)',
          border: '1px solid rgba(212,195,191,0.2)',
          position: 'relative',
        }}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          style={{
            position: 'absolute',
            top: 16,
            right: 16,
            width: 36,
            height: 36,
            borderRadius: '50%',
            backgroundColor: 'rgba(255,255,255,0.9)',
            border: 'none',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: 'var(--shadow-sm)',
            zIndex: 20,
            transition: 'background-color 0.2s',
          }}
          onMouseEnter={e => (e.currentTarget.style.backgroundColor = 'white')}
          onMouseLeave={e => (e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.9)')}
        >
          <span className="material-symbols-outlined" style={{ fontSize: 20, color: 'var(--color-primary)' }}>close</span>
        </button>

        {/* Media Block (Zoomable & Pannable Image/Video) */}
        <div
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleMouseUp}
          style={{
            position: 'relative',
            height: 480,
            backgroundColor: 'var(--color-surface-container)',
            overflow: 'hidden',
            userSelect: 'none',
            touchAction: zoom > 1 ? 'none' : 'auto',
          }}
        >
          {product.video_url ? (
            <video
              src={product.video_url}
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'cover',
                transform: `scale(${zoom}) translate(${position.x / zoom}px, ${position.y / zoom}px)`,
                cursor: zoom > 1 ? (isDragging ? 'grabbing' : 'grab') : 'default',
                transition: isDragging ? 'none' : 'transform 0.15s ease-out',
              }}
              muted
              loop
              autoPlay
              playsInline
              controls={zoom === 1}
            />
          ) : product.image_url ? (
            <img
              src={product.image_url}
              alt={product.name}
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'cover',
                transform: `scale(${zoom}) translate(${position.x / zoom}px, ${position.y / zoom}px)`,
                cursor: zoom > 1 ? (isDragging ? 'grabbing' : 'grab') : 'zoom-in',
                transition: isDragging ? 'none' : 'transform 0.15s ease-out',
              }}
              onClick={() => {
                if (zoom === 1) {
                  setZoom(2.5);
                }
              }}
            />
          ) : (
            <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <span className="material-symbols-outlined" style={{ fontSize: 64, color: 'var(--color-outline)' }}>cake</span>
            </div>
          )}

          {/* Badge */}
          {product.badge && (
            <div style={{
              position: 'absolute',
              top: 16,
              left: 16,
              backgroundColor: 'var(--color-tertiary)',
              color: 'var(--color-on-tertiary)',
              padding: '4px 12px',
              borderRadius: 'var(--radius-full)',
              boxShadow: 'var(--shadow-sm)',
              zIndex: 10,
            }}>
              <span className="label-sm" style={{ fontWeight: 700, fontSize: 11 }}>
                {product.badge.toUpperCase()}
              </span>
            </div>
          )}

          {/* Zoom Overlay instructions when zoomed */}
          {zoom > 1 && (
            <div style={{
              position: 'absolute',
              top: 16,
              right: 64,
              backgroundColor: 'rgba(54,31,26,0.85)',
              color: 'white',
              padding: '6px 12px',
              borderRadius: 'var(--radius-md)',
              fontSize: 12,
              pointerEvents: 'none',
              zIndex: 10,
            }}>
              Drag to see all details
            </div>
          )}

          {/* Floating Zoom Controls */}
          {(product.image_url || product.video_url) && (
            <div style={{
              position: 'absolute',
              bottom: 16,
              right: 16,
              display: 'flex',
              gap: 8,
              zIndex: 10,
            }}>
              {zoom > 1 ? (
                <button
                  onClick={(e) => { e.stopPropagation(); handleZoomOut(); }}
                  style={zoomButtonStyle}
                  title="Zoom Out"
                  onMouseEnter={e => (e.currentTarget.style.backgroundColor = 'white')}
                  onMouseLeave={e => (e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.95)')}
                >
                  <span className="material-symbols-outlined" style={{ fontSize: 20, color: 'var(--color-primary)' }}>zoom_out</span>
                </button>
              ) : (
                <button
                  onClick={(e) => { e.stopPropagation(); handleZoomIn(); }}
                  style={zoomButtonStyle}
                  title="Zoom In"
                  onMouseEnter={e => (e.currentTarget.style.backgroundColor = 'white')}
                  onMouseLeave={e => (e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.95)')}
                >
                  <span className="material-symbols-outlined" style={{ fontSize: 20, color: 'var(--color-primary)' }}>zoom_in</span>
                </button>
              )}
            </div>
          )}
        </div>

        {/* Details Block */}
        <div style={{ padding: 32, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
          <div>
            <p className="label-md" style={{ color: 'var(--color-secondary)', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: 8 }}>
              {product.category.replace(/-/g, ' ')}
            </p>
            <h2 className="headline-md" style={{ color: 'var(--color-primary)', marginBottom: 12, lineHeight: 1.2 }}>
              {product.name}
            </h2>
            <p style={{
              fontSize: 22,
              fontWeight: 700,
              color: 'var(--color-primary)',
              marginBottom: 20,
            }}>
              ₦{Number(product.price).toLocaleString()}
            </p>
          </div>

          <div style={{
            borderTop: '1px solid rgba(212,195,191,0.3)',
            paddingTop: 20,
            marginBottom: 28,
            flex: 1,
          }}>
            <p className="body-md" style={{ color: 'var(--color-on-surface-variant)', lineHeight: 1.6 }}>
              {product.description || 'No description provided for this cake.'}
            </p>
          </div>

          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-primary"
            style={{
              textDecoration: 'none',
              justifyContent: 'center',
              padding: '12px 24px',
              borderRadius: 'var(--radius-full)',
              fontSize: 14,
              fontWeight: 700,
              display: 'flex',
              alignItems: 'center',
              gap: 8,
              boxShadow: 'var(--shadow-sm)',
            }}
          >
            <span className="material-symbols-outlined" style={{ fontSize: 18 }}>chat</span>
            Order on WhatsApp
          </a>
        </div>
      </div>
    </div>
  );
}
