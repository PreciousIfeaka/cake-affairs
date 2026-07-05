import React, { useState, useEffect } from 'react';
import Header from '../components/common/Header';
import AddProductForm from '../components/admin/AddProductForm';
import ProductListingGrid from '../components/admin/ProductListingGrid';
import ImageUploadZone from '../components/admin/ImageUploadZone';
import { useProducts } from '../hooks/useProducts';
import { setAdminKey, getSetting, updateSetting, uploadGalleryImage, login, logout, forgotPassword, resetPassword, changePassword } from '../services/api';
import { uploadDirectToCloudinary } from '../utils/cloudinaryUpload';
import { Product } from '../types';
import ProductDetailModal from '../components/catalogue/ProductDetailModal';

const EXPIRE_TIME_MS = 24 * 60 * 60 * 1000; // 24 hours

function isStoredAdminLoggedIn(): boolean {
  const loggedIn = localStorage.getItem('admin_logged_in');
  const expiry = localStorage.getItem('admin_key_expiry');
  if (!loggedIn || !expiry) return false;
  
  if (Date.now() > parseInt(expiry, 10)) {
    localStorage.removeItem('admin_logged_in');
    localStorage.removeItem('admin_key_expiry');
    return false;
  }
  return true;
}

export default function AdminPage() {
  const { products, loading, refetch } = useProducts({ limit: 50 });
  const [authenticated, setAuthenticated] = useState<boolean>(() => isStoredAdminLoggedIn());
  const [loginStage, setLoginStage] = useState<'login' | 'forgot' | 'reset'>('login');
  const [emailInput, setEmailInput] = useState<string>('');
  const [passwordInput, setPasswordInput] = useState<string>('');

  // Forgot / Reset password states
  const [otpInput, setOtpInput] = useState<string>('');
  const [newPasswordInput, setNewPasswordInput] = useState<string>('');
  const [confirmNewPasswordInput, setConfirmNewPasswordInput] = useState<string>('');

  // Change password states (inside dashboard)
  const [changePasswordCurrent, setChangePasswordCurrent] = useState<string>('');
  const [changePasswordNew, setChangePasswordNew] = useState<string>('');
  const [changePasswordConfirm, setChangePasswordConfirm] = useState<string>('');
  const [savingChangePassword, setSavingChangePassword] = useState<boolean>(false);

  const [submittingLogin, setSubmittingLogin] = useState<boolean>(false);
  const [statusMsg, setStatusMsg] = useState<string>('');
  const [loginError, setLoginError] = useState<string>('');
  const [whatsappNumber, setWhatsappNumber] = useState<string>('');
  const [savingWa, setSavingWa] = useState<boolean>(false);
  const [galleryFile, setGalleryFile] = useState<File | null>(null);
  const [galleryPreviewUrl, setGalleryPreviewUrl] = useState<string>(''); // currently saved URL
  const [savingGallery, setSavingGallery] = useState<boolean>(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [selectedViewProduct, setSelectedViewProduct] = useState<Product | null>(null);

  useEffect(() => {
    getSetting('whatsapp_number').then(r => setWhatsappNumber(r.data.value)).catch(() => {});
    getSetting('gallery_image_url').then(r => setGalleryPreviewUrl(r.data.value)).catch(() => {});
  }, []);

  async function handleLogin(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!emailInput || !passwordInput) return;
    setSubmittingLogin(true);
    setLoginError('');
    setStatusMsg('Logging in...');
    try {
      const res = await login(emailInput, passwordInput);
      const token = res.data.token;
      
      const expiryTime = Date.now() + EXPIRE_TIME_MS;
      localStorage.setItem('admin_logged_in', 'true');
      localStorage.setItem('admin_key_expiry', expiryTime.toString());
      if (token) {
        setAdminKey(token); // Fallback header
      }
      setAuthenticated(true);
      setStatusMsg('');
    } catch (err: any) {
      setLoginError(err.response?.data?.error || 'Login failed. Please check your credentials.');
      setStatusMsg('');
    } finally {
      setSubmittingLogin(false);
    }
  }

  async function handleForgotPassword(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!emailInput) return;
    setSubmittingLogin(true);
    setLoginError('');
    setStatusMsg('Sending reset code...');
    try {
      await forgotPassword(emailInput);
      setLoginStage('reset');
      setStatusMsg('Reset code sent! Please check your inbox.');
    } catch (err: any) {
      setLoginError(err.response?.data?.error || 'Failed to send reset code.');
      setStatusMsg('');
    } finally {
      setSubmittingLogin(false);
    }
  }

  async function handleResetPassword(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!emailInput || !otpInput || !newPasswordInput || !confirmNewPasswordInput) return;
    if (newPasswordInput !== confirmNewPasswordInput) {
      setLoginError('Passwords do not match.');
      return;
    }
    setSubmittingLogin(true);
    setLoginError('');
    setStatusMsg('Resetting password...');
    try {
      const res = await resetPassword(emailInput, otpInput, newPasswordInput);
      const token = res.data.token;
      
      const expiryTime = Date.now() + EXPIRE_TIME_MS;
      localStorage.setItem('admin_logged_in', 'true');
      localStorage.setItem('admin_key_expiry', expiryTime.toString());
      if (token) {
        setAdminKey(token);
      }
      setAuthenticated(true);
      setStatusMsg('');
      setLoginStage('login');
      setOtpInput('');
      setNewPasswordInput('');
      setConfirmNewPasswordInput('');
    } catch (err: any) {
      setLoginError(err.response?.data?.error || 'Failed to reset password.');
      setStatusMsg('');
    } finally {
      setSubmittingLogin(false);
    }
  }

  async function handleChangePassword(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!changePasswordCurrent || !changePasswordNew || !changePasswordConfirm) return;
    if (changePasswordNew !== changePasswordConfirm) {
      alert('New passwords do not match.');
      return;
    }
    setSavingChangePassword(true);
    try {
      await changePassword(changePasswordCurrent, changePasswordNew);
      alert('Password updated successfully!');
      setChangePasswordCurrent('');
      setChangePasswordNew('');
      setChangePasswordConfirm('');
    } catch (err: any) {
      alert(err.response?.data?.error || 'Failed to change password. Please check your current password.');
    } finally {
      setSavingChangePassword(false);
    }
  }

  async function handleLogout() {
    try {
      await logout();
    } catch (err) {
      console.error('Failed to logout from server:', err);
    }
    localStorage.removeItem('admin_logged_in');
    localStorage.removeItem('admin_key_expiry');
    setAdminKey('');
    setAuthenticated(false);
    setEmailInput('');
    setPasswordInput('');
    setLoginStage('login');
  }

  async function saveWhatsapp(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSavingWa(true);
    try {
      await updateSetting('whatsapp_number', whatsappNumber);
      alert('WhatsApp number updated!');
    } catch { alert('Failed to save. Check your admin key.'); }
    finally { setSavingWa(false); }
  }

  async function saveGalleryImage(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!galleryFile) return;
    setSavingGallery(true);
    try {
      const uploadRes = await uploadDirectToCloudinary(galleryFile, 'cake-affairs/gallery');
      const res = await uploadGalleryImage({
        url: uploadRes.url,
        public_id: uploadRes.public_id
      });
      setGalleryPreviewUrl(res.data.url);
      setGalleryFile(null);
      alert('Gallery banner image updated!');
    } catch { alert('Failed to upload. Check your connection and try again.'); }
    finally { setSavingGallery(false); }
  }

  if (!authenticated) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--color-background)' }}>
        <div style={{ width: '100%', maxWidth: 400, padding: 40, backgroundColor: 'var(--color-surface-container-lowest)', borderRadius: 'var(--radius-xl)', boxShadow: 'var(--shadow-lg)' }}>
          <h1 className="headline-sm" style={{ color: 'var(--color-primary)', marginBottom: 8 }}>
            {loginStage === 'login' && 'Admin Login'}
            {loginStage === 'forgot' && 'Forgot Password'}
            {loginStage === 'reset' && 'Reset Password'}
          </h1>
          <p className="body-md" style={{ color: 'var(--color-secondary)', marginBottom: 24 }}>
            {loginStage === 'login' && 'Enter your admin email and password.'}
            {loginStage === 'forgot' && 'Enter your admin email to receive a password reset code.'}
            {loginStage === 'reset' && 'Enter the 6-digit code sent to your email and your new password.'}
          </p>

          {loginStage === 'login' && (
            <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              <input 
                type="email" 
                className="input-field" 
                placeholder="Admin Email" 
                value={emailInput} 
                onChange={e => setEmailInput(e.target.value)} 
                required 
                disabled={submittingLogin}
              />
              <input 
                type="password" 
                className="input-field" 
                placeholder="Password" 
                value={passwordInput} 
                onChange={e => setPasswordInput(e.target.value)} 
                required 
                disabled={submittingLogin}
              />
              <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                <button 
                  type="button" 
                  onClick={() => { setLoginStage('forgot'); setLoginError(''); setStatusMsg(''); }}
                  style={{ background: 'none', border: 'none', color: 'var(--color-primary)', cursor: 'pointer', padding: 0 }}
                  className="label-sm"
                >
                  Forgot Password?
                </button>
              </div>
              {statusMsg && <p className="label-sm" style={{ color: 'var(--color-primary)' }}>{statusMsg}</p>}
              {loginError && <p className="label-sm" style={{ color: 'var(--color-error)' }}>{loginError}</p>}
              <button type="submit" className="btn-primary" style={{ justifyContent: 'center' }} disabled={submittingLogin}>
                {submittingLogin ? 'Logging in...' : 'Login'}
              </button>
            </form>
          )}

          {loginStage === 'forgot' && (
            <form onSubmit={handleForgotPassword} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              <input 
                type="email" 
                className="input-field" 
                placeholder="Admin Email" 
                value={emailInput} 
                onChange={e => setEmailInput(e.target.value)} 
                required 
                disabled={submittingLogin}
              />
              {statusMsg && <p className="label-sm" style={{ color: 'var(--color-primary)' }}>{statusMsg}</p>}
              {loginError && <p className="label-sm" style={{ color: 'var(--color-error)' }}>{loginError}</p>}
              <div style={{ display: 'flex', gap: 12 }}>
                <button 
                  type="button" 
                  className="btn-secondary" 
                  style={{ flex: 1, justifyContent: 'center' }} 
                  onClick={() => { setLoginStage('login'); setLoginError(''); setStatusMsg(''); }}
                  disabled={submittingLogin}
                >
                  Back
                </button>
                <button type="submit" className="btn-primary" style={{ flex: 2, justifyContent: 'center' }} disabled={submittingLogin}>
                  {submittingLogin ? 'Sending...' : 'Send Reset Code'}
                </button>
              </div>
            </form>
          )}

          {loginStage === 'reset' && (
            <form onSubmit={handleResetPassword} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              <input 
                type="text" 
                className="input-field" 
                placeholder="6-digit Code" 
                maxLength={6}
                value={otpInput} 
                onChange={e => setOtpInput(e.target.value)} 
                required 
                disabled={submittingLogin}
              />
              <input 
                type="password" 
                className="input-field" 
                placeholder="New Password (min. 6 chars)" 
                value={newPasswordInput} 
                onChange={e => setNewPasswordInput(e.target.value)} 
                required 
                disabled={submittingLogin}
              />
              <input 
                type="password" 
                className="input-field" 
                placeholder="Confirm New Password" 
                value={confirmNewPasswordInput} 
                onChange={e => setConfirmNewPasswordInput(e.target.value)} 
                required 
                disabled={submittingLogin}
              />
              {statusMsg && <p className="label-sm" style={{ color: 'var(--color-primary)' }}>{statusMsg}</p>}
              {loginError && <p className="label-sm" style={{ color: 'var(--color-error)' }}>{loginError}</p>}
              <div style={{ display: 'flex', gap: 12 }}>
                <button 
                  type="button" 
                  className="btn-secondary" 
                  style={{ flex: 1, justifyContent: 'center' }} 
                  onClick={() => { setLoginStage('login'); setLoginError(''); setStatusMsg(''); }}
                  disabled={submittingLogin}
                >
                  Cancel
                </button>
                <button type="submit" className="btn-primary" style={{ flex: 2, justifyContent: 'center' }} disabled={submittingLogin}>
                  {submittingLogin ? 'Resetting...' : 'Reset & Login'}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    );
  }

  return (
    <>
      <Header isAdmin />
      <main style={{ paddingTop: 120, paddingBottom: 64, maxWidth: 'var(--container-max)', marginInline: 'auto', padding: '120px var(--spacing-margin-mobile) 64px' }}>

        {/* Header */}
        <section style={{ marginBottom: 'var(--spacing-section-gap)', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <div>
            <h1 className="display-lg-mobile" style={{ color: 'var(--color-primary)', marginBottom: 12 }}>Bakery Management</h1>
            <p className="body-lg" style={{ color: 'var(--color-secondary)', maxWidth: 520 }}>
              Curate your display case. Add your latest artisanal creations and manage your inventory with precision.
            </p>
          </div>
          <button onClick={handleLogout} className="btn-secondary" style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <span className="material-symbols-outlined" style={{ fontSize: 20 }}>logout</span>
            Logout
          </button>
        </section>

        {/* Bento grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: 'var(--spacing-gutter)', alignItems: 'start' }}>
          <div style={{ gridColumn: 'span 2' }}>
            <AddProductForm
              onSuccess={refetch}
              editingProduct={editingProduct}
              onCancelEdit={() => setEditingProduct(null)}
            />
          </div>

          {/* Sidebar */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-gutter)' }}>
            {/* Stats */}
            <div style={{ backgroundColor: 'var(--color-primary-container)', borderRadius: 'var(--radius-xl)', padding: 24, boxShadow: 'var(--shadow-sm)' }}>
              <h3 className="headline-sm" style={{ color: 'var(--color-primary-fixed-dim)', marginBottom: 16 }}>Stock Insights</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                {[
                  { label: 'Active Listings', value: products.length },
                ].map(item => (
                  <div key={item.label} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', borderBottom: '1px solid rgba(92,64,58,0.3)', paddingBottom: 8 }}>
                    <span className="label-sm" style={{ color: 'rgba(255,255,255,0.8)' }}>{item.label}</span>
                    <span style={{ fontSize: 24, fontWeight: 700, color: 'white' }}>{item.value}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* WhatsApp Settings */}
            <div style={{ backgroundColor: 'var(--color-surface-container-low)', borderRadius: 'var(--radius-xl)', padding: 24, boxShadow: 'var(--shadow-sm)', border: '1px solid rgba(212,195,191,0.3)' }}>
              <h3 className="label-md" style={{ color: 'var(--color-primary)', marginBottom: 4, display: 'flex', alignItems: 'center', gap: 8 }}>
                <span className="material-symbols-outlined" style={{ fontSize: 18 }}>chat</span>
                WhatsApp Contact
              </h3>
              <p className="label-sm" style={{ color: 'var(--color-on-surface-variant)', marginBottom: 16 }}>
                This number is used in all "Order Now" buttons on the catalogue.
              </p>
              <form onSubmit={saveWhatsapp} style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                <input
                  type="text" className="input-field"
                  placeholder="e.g. 2348012345678 (include country code, no +)"
                  value={whatsappNumber}
                  onChange={e => setWhatsappNumber(e.target.value)}
                />
                <button type="submit" className="btn-primary" style={{ justifyContent: 'center' }} disabled={savingWa}>
                  {savingWa ? 'Saving...' : 'Save Number'}
                </button>
              </form>
            </div>

            {/* Gallery Image */}
            <div style={{ backgroundColor: 'var(--color-surface-container-low)', borderRadius: 'var(--radius-xl)', padding: 24, boxShadow: 'var(--shadow-sm)', border: '1px solid rgba(212,195,191,0.3)' }}>
              <h3 className="label-md" style={{ color: 'var(--color-primary)', marginBottom: 4, display: 'flex', alignItems: 'center', gap: 8 }}>
                <span className="material-symbols-outlined" style={{ fontSize: 18 }}>image</span>
                Gallery Banner Image
              </h3>
              <p className="label-sm" style={{ color: 'var(--color-on-surface-variant)', marginBottom: 16 }}>
                Upload an image for the hero banner shown at the top of the catalogue.
              </p>
              <form onSubmit={saveGalleryImage} style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                <ImageUploadZone
                  key={galleryPreviewUrl}
                  onFileReady={file => setGalleryFile(file)}
                  labelText=""
                  accept="image/*"
                  aspectRatio="16 / 9"
                />
                {/* Show currently saved image when no new file selected */}
                {!galleryFile && galleryPreviewUrl && (
                  <div style={{ position: 'relative' }}>
                    <p className="label-sm" style={{ color: 'var(--color-on-surface-variant)', marginBottom: 6 }}>Current banner:</p>
                    <img
                      src={galleryPreviewUrl}
                      alt="Current gallery banner"
                      style={{ width: '100%', aspectRatio: '16/9', objectFit: 'cover', borderRadius: 'var(--radius-lg)' }}
                    />
                  </div>
                )}
                <button
                  type="submit"
                  className="btn-primary"
                  style={{ justifyContent: 'center' }}
                  disabled={savingGallery || !galleryFile}
                >
                  {savingGallery ? 'Uploading...' : 'Upload Banner Image'}
                </button>
              </form>
            </div>

            {/* Change Password */}
            <div style={{ backgroundColor: 'var(--color-surface-container-low)', borderRadius: 'var(--radius-xl)', padding: 24, boxShadow: 'var(--shadow-sm)', border: '1px solid rgba(212,195,191,0.3)' }}>
              <h3 className="label-md" style={{ color: 'var(--color-primary)', marginBottom: 4, display: 'flex', alignItems: 'center', gap: 8 }}>
                <span className="material-symbols-outlined" style={{ fontSize: 18 }}>lock</span>
                Change Admin Password
              </h3>
              <p className="label-sm" style={{ color: 'var(--color-on-surface-variant)', marginBottom: 16 }}>
                Update your login password.
              </p>
              <form onSubmit={handleChangePassword} style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                <input
                  type="password" className="input-field"
                  placeholder="Current Password"
                  value={changePasswordCurrent}
                  onChange={e => setChangePasswordCurrent(e.target.value)}
                  required
                />
                <input
                  type="password" className="input-field"
                  placeholder="New Password (min 6 chars)"
                  value={changePasswordNew}
                  onChange={e => setChangePasswordNew(e.target.value)}
                  required
                />
                <input
                  type="password" className="input-field"
                  placeholder="Confirm New Password"
                  value={changePasswordConfirm}
                  onChange={e => setChangePasswordConfirm(e.target.value)}
                  required
                />
                <button type="submit" className="btn-primary" style={{ justifyContent: 'center' }} disabled={savingChangePassword}>
                  {savingChangePassword ? 'Saving...' : 'Save Password'}
                </button>
              </form>
            </div>

            {/* Pro tip */}
            <div style={{ backgroundColor: 'var(--color-surface-container-high)', borderRadius: 'var(--radius-xl)', padding: 24, boxShadow: 'var(--shadow-sm)', border: '1px solid rgba(212,195,191,0.3)' }}>
              <h3 className="label-md" style={{ color: 'var(--color-primary)', marginBottom: 8, display: 'flex', alignItems: 'center', gap: 8 }}>
                <span className="material-symbols-outlined" style={{ fontSize: 18 }}>info</span>
                Pro Tip
              </h3>
              <p className="label-sm" style={{ color: 'var(--color-on-surface-variant)', fontStyle: 'italic', lineHeight: 1.6 }}>
                "High-fidelity close-ups of cake textures (flaky crusts, airy crumbs) tend to increase conversions."
              </p>
            </div>
          </div>
        </div>

        {/* Current Listings */}
        <section style={{ marginTop: 'var(--spacing-section-gap)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: 32 }}>
            <div>
              <h2 className="headline-md" style={{ color: 'var(--color-primary)' }}>Current Listings</h2>
              <p className="body-md" style={{ color: 'var(--color-secondary)' }}>Manage your active display case items.</p>
            </div>
          </div>
          {loading ? (
            <div style={{ textAlign: 'center', padding: 48 }}>
              <span className="material-symbols-outlined" style={{ fontSize: 40, color: 'var(--color-secondary)' }}>refresh</span>
            </div>
          ) : (
            <ProductListingGrid
              products={products}
              onRefresh={refetch}
              onEdit={(product) => {
                setEditingProduct(product);
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              onView={setSelectedViewProduct}
            />
          )}
        </section>

      </main>

      {selectedViewProduct && (
        <ProductDetailModal
          product={selectedViewProduct}
          whatsappNumber={whatsappNumber}
          onClose={() => setSelectedViewProduct(null)}
        />
      )}
    </>
  );
}
