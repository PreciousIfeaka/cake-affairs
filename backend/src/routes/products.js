const router = require('express').Router();
const auth = require('../middleware/auth');
const validate = require('../middleware/validate');
const {
  listProductsSchema,
  getProductSchema,
  createProductSchema,
  updateProductSchema
} = require('../middleware/schemas');
const ctrl = require('../controllers/productController');

router.get('/', validate(listProductsSchema, 'query'), ctrl.listProducts);
router.get('/categories', ctrl.listCategories);
router.get('/category-samples', ctrl.listCategorySamples);
router.get('/:id', validate(getProductSchema, 'params'), ctrl.getProduct);

router.post('/', auth, validate(createProductSchema, 'body'), ctrl.createProduct);
router.put('/:id', auth, validate(getProductSchema, 'params'), validate(updateProductSchema, 'body'), ctrl.updateProduct);
router.delete('/:id', auth, validate(getProductSchema, 'params'), ctrl.deleteProduct);

module.exports = router;
