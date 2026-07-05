import React, { useState, useEffect } from 'react';
import ImageUploadZone from './ImageUploadZone';
import { createProduct, updateProduct } from '../../services/api';
import { uploadDirectToCloudinary } from '../../utils/cloudinaryUpload';
import { Product } from '../../types';

interface AddProductFormProps {
  onSuccess?: () => void;
  editingProduct?: Product | null;
  onCancelEdit?: () => void;
}

interface FormDataState {
  name: string;
  price: string;
  category: string;
  description: string;
  badge: string;
}

export default function AddProductForm({ onSuccess, editingProduct = null, onCancelEdit }: AddProductFormProps) {
  const [formData, setFormData] = useState<FormDataState>({ name: '', price: '', category: '', description: '', badge: '' });
  const [file, setFile] = useState<File | null>(null);
  const [submitting, setSubmitting] = useState<boolean>(false);
  const [submitStatus, setSubmitStatus] = useState<'success' | 'error' | null>(null);
  const [errorMsg, setErrorMsg] = useState<string>('');
  const [uploadKey, setUploadKey] = useState<number>(0);

  // Sync form state when editingProduct changes
  useEffect(() => {
    if (editingProduct) {
      setFormData({
        name: editingProduct.name,
        price: editingProduct.price.toString(),
        category: editingProduct.category,
        description: editingProduct.description || '',
        badge: editingProduct.badge || '',
      });
      setFile(null);
    } else {
      setFormData({ name: '', price: '', category: '', description: '', badge: '' });
      setFile(null);
    }
    setUploadKey(prev => prev + 1); // Reset image upload zone state
    setSubmitStatus(null);
    setErrorMsg('');
  }, [editingProduct]);

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!formData.name || !formData.price || !formData.category) {
      setErrorMsg('Name, price and category are required.');
      return;
    }
    setSubmitting(true);
    setErrorMsg('');
    setSubmitStatus(null);

    try {
      let image_url = editingProduct ? editingProduct.image_url : null;
      let video_url = editingProduct ? editingProduct.video_url : null;
      let public_id = editingProduct ? editingProduct.public_id : null;

      if (file) {
        // Upload directly to Cloudinary from the browser
        const uploadResult = await uploadDirectToCloudinary(file);
        public_id = uploadResult.public_id;
        if (uploadResult.is_video) {
          video_url = uploadResult.url;
          image_url = null;
        } else {
          image_url = uploadResult.url;
          video_url = null;
        }
      }

      const payload = {
        ...formData,
        price: parseFloat(formData.price),
        image_url,
        video_url,
        public_id
      };

      if (editingProduct) {
        await updateProduct(editingProduct.id, payload);
      } else {
        await createProduct(payload);
      }

      setSubmitStatus('success');
      setFormData({ name: '', price: '', category: '', description: '', badge: '' });
      setFile(null);
      setUploadKey(prev => prev + 1); // Reset the image upload zone preview
      setTimeout(() => {
        setSubmitStatus(null);
        onSuccess?.();
        if (editingProduct && onCancelEdit) {
          onCancelEdit();
        }
      }, 2000);
    } catch (err: any) {
      setSubmitStatus('error');
      setErrorMsg(err.response?.data?.error || 'Failed to save product.');
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <section style={{
      backgroundColor: 'var(--color-surface-container-lowest)',
      borderRadius: 'var(--radius-xl)',
      padding: 32,
      boxShadow: 'var(--shadow-sm)',
      border: '1px solid rgba(212,195,191,0.2)',
    }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 32 }}>
        <h2 className="headline-sm" style={{ color: 'var(--color-primary)' }}>
          {editingProduct ? 'Edit Cake Masterpiece' : 'Add New Cake'}
        </h2>
        {editingProduct && (
          <span className="material-symbols-outlined" style={{ color: 'var(--color-outline)' }}>
            edit_note
          </span>
        )}
      </div>

      <form onSubmit={handleSubmit}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: 24 }}>
          {/* Image Upload & Staged Media Preview */}
          <div>
            <ImageUploadZone key={uploadKey} onFileReady={setFile} />
            {!file && editingProduct && (editingProduct.image_url || editingProduct.video_url) && (
              <div style={{ marginTop: 16 }}>
                <p className="label-sm" style={{ color: 'var(--color-on-surface-variant)', marginBottom: 6 }}>Current media:</p>
                {editingProduct.video_url ? (
                  <video
                    src={editingProduct.video_url}
                    style={{ width: '100%', maxHeight: 160, objectFit: 'cover', borderRadius: 'var(--radius-lg)' }}
                    muted
                    controls
                  />
                ) : (
                  <img
                    src={editingProduct.image_url!}
                    style={{ width: '100%', maxHeight: 160, objectFit: 'cover', borderRadius: 'var(--radius-lg)' }}
                    alt="Current product media"
                  />
                )}
              </div>
            )}
          </div>

          {/* Form Fields */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
            <div>
              <label className="label-md" htmlFor="name" style={{ display: 'block', marginBottom: 8, color: 'var(--color-on-surface-variant)' }}>Cake Name *</label>
              <input id="name" name="name" type="text" className="input-field" placeholder="e.g. Vanilla Bean Cloud" value={formData.name} onChange={handleChange} required />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
              <div>
                <label className="label-md" htmlFor="price" style={{ display: 'block', marginBottom: 8, color: 'var(--color-on-surface-variant)' }}>Price (₦) *</label>
                <input id="price" name="price" type="number" min="0" step="0.01" className="input-field" placeholder="45.00" value={formData.price} onChange={handleChange} required />
              </div>
              <div>
                <label className="label-md" htmlFor="category" style={{ display: 'block', marginBottom: 8, color: 'var(--color-on-surface-variant)' }}>Category *</label>
                <input id="category" name="category" type="text" className="input-field" placeholder="e.g. Wedding, Vegan..." value={formData.category} onChange={handleChange} required />
              </div>
            </div>

            <div>
              <label className="label-md" htmlFor="badge" style={{ display: 'block', marginBottom: 8, color: 'var(--color-on-surface-variant)' }}>Badge (optional)</label>
              <input id="badge" name="badge" type="text" className="input-field" placeholder="e.g. Best Seller, New, Vegan" value={formData.badge} onChange={handleChange} />
            </div>

            <div>
              <label className="label-md" htmlFor="description" style={{ display: 'block', marginBottom: 8, color: 'var(--color-on-surface-variant)' }}>Description</label>
              <textarea id="description" name="description" className="input-field" placeholder="Describe the flavors, textures, and inspiration..." rows={4} style={{ resize: 'vertical' }} value={formData.description} onChange={handleChange} />
            </div>
          </div>
        </div>

        {errorMsg && (
          <p className="label-sm" style={{ color: 'var(--color-error)', marginTop: 16 }}>{errorMsg}</p>
        )}

        <div style={{ display: 'flex', gap: 12, justifyContent: 'flex-end', marginTop: 24 }}>
          {editingProduct && (
            <button
              type="button"
              className="btn-secondary"
              onClick={onCancelEdit}
              disabled={submitting}
            >
              Cancel
            </button>
          )}
          <button
            type="submit"
            className="btn-primary"
            disabled={submitting}
            style={{
              backgroundColor: submitStatus === 'success' ? 'var(--color-tertiary-container)' : undefined,
            }}
          >
            <span className="material-symbols-outlined" style={{ fontSize: 20, animation: submitting ? 'spin 1s linear infinite' : 'none' }}>
              {submitting ? 'refresh' : submitStatus === 'success' ? 'check' : editingProduct ? 'save' : 'add'}
            </span>
            {submitting ? (editingProduct ? 'Saving...' : 'Publishing...') : submitStatus === 'success' ? (editingProduct ? 'Saved!' : 'Published!') : (editingProduct ? 'Save Changes' : 'Publish to Catalog')}
          </button>
        </div>
      </form>
    </section>
  );
}
