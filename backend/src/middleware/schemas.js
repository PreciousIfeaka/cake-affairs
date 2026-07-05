const { z } = require('zod');

const preprocessNumber = z.preprocess(val => {
  if (val === '' || val === undefined || val === null) return undefined;
  return val;
}, z.coerce.number().nonnegative().optional());

const listProductsSchema = z.object({
  category: z.string().optional(),
  minPrice: preprocessNumber,
  maxPrice: preprocessNumber,
  search: z.string().optional(),
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().positive().default(20)
});

const getProductSchema = z.object({
  id: z.string().length(10)
});

const createProductSchema = z.object({
  name: z.string().min(1, 'Name is required').max(100),
  description: z.string().max(1000).optional().nullable(),
  price: z.preprocess(val => {
    if (typeof val === 'string') return parseFloat(val);
    return val;
  }, z.number().nonnegative('Price must be non-negative')),
  category: z.string().min(1, 'Category is required').max(50),
  badge: z.string().max(30).optional().nullable(),
  image_url: z.string().optional().nullable(),
  video_url: z.string().optional().nullable(),
  public_id: z.string().optional().nullable(),
});

const updateProductSchema = z.object({
  name: z.string().min(1).max(100).optional(),
  description: z.string().max(1000).optional().nullable(),
  price: z.preprocess(val => {
    if (val === undefined || val === '') return undefined;
    if (typeof val === 'string') return parseFloat(val);
    return val;
  }, z.number().nonnegative().optional()),
  category: z.string().min(1).max(50).optional(),
  badge: z.string().max(30).optional().nullable(),
  image_url: z.string().optional().nullable(),
  video_url: z.string().optional().nullable(),
  public_id: z.string().optional().nullable(),
});

const settingKeySchema = z.object({
  key: z.string().min(1)
});

const updateSettingSchema = z.object({
  value: z.string()
});

const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters')
});

const forgotPasswordSchema = z.object({
  email: z.string().email('Invalid email address')
});

const resetPasswordSchema = z.object({
  email: z.string().email('Invalid email address'),
  code: z.string().length(6, 'Verification code must be 6 digits'),
  newPassword: z.string().min(6, 'New password must be at least 6 characters')
});

const changePasswordSchema = z.object({
  currentPassword: z.string().min(1, 'Current password is required'),
  newPassword: z.string().min(6, 'New password must be at least 6 characters')
});

module.exports = {
  listProductsSchema,
  getProductSchema,
  createProductSchema,
  updateProductSchema,
  settingKeySchema,
  updateSettingSchema,
  loginSchema,
  forgotPasswordSchema,
  resetPasswordSchema,
  changePasswordSchema
};
