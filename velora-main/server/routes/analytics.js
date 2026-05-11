// routes/analytics.js - AGGREGATION PIPELINES FOR ADMIN DASHBOARD
const express = require('express');
const router = express.Router();
const Order = require('../models/Order');
const Product = require('../models/Product');
const adminAuth = require('../middleware/adminAuth');

// ✅ AGGREGATION EXAMPLE #1: Sales by Category
router.get('/sales-by-category', adminAuth, async (req, res) => {
  try {
    const results = await Order.aggregate([
      { $match: { status: { $in: ['processing', 'shipped', 'delivered'] } } },
      { $unwind: '$items' },
      {
        $lookup: {
          from: 'products',
          localField: 'items.productId',
          foreignField: '_id',
          as: 'productInfo'
        }
      },
      { $unwind: { path: '$productInfo', preserveNullAndEmptyArrays: true } },
      {
        $group: {
          _id: '$productInfo.category',
          totalOrders: { $sum: 1 },
          totalQuantity: { $sum: '$items.quantity' },
          categories: { $addToSet: '$productInfo.category' }
        }
      },
      { $sort: { totalQuantity: -1 } }
    ]);

    res.json(results);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// ✅ AGGREGATION EXAMPLE #2: Revenue by Month
router.get('/revenue-by-month', adminAuth, async (req, res) => {
  try {
    const results = await Order.aggregate([
      { $match: { status: { $ne: 'cancelled' } } },
      {
        $group: {
          _id: {
            year: { $year: '$createdAt' },
            month: { $month: '$createdAt' }
          },
          totalOrders: { $count: {} },
          orders: { $push: '$$ROOT' }
        }
      },
      {
        $project: {
          year: '$_id.year',
          month: '$_id.month',
          totalOrders: 1,
          // Extract numeric value from price strings like "PKR 2,500"
          totalRevenue: {
            $sum: {
              $map: {
                input: '$orders',
                as: 'order',
                in: {
                  $toDouble: {
                    $replaceAll: {
                      input: {
                        $replaceAll: {
                          input: '$$order.total',
                          find: 'PKR ',
                          replacement: ''
                        }
                      },
                      find: ',',
                      replacement: ''
                    }
                  }
                }
              }
            }
          }
        }
      },
      { $sort: { year: -1, month: -1 } }
    ]);

    res.json(results);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// ✅ AGGREGATION EXAMPLE #3: Top Selling Products
router.get('/top-products', adminAuth, async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 10;

    const results = await Order.aggregate([
      { $match: { status: { $in: ['processing', 'shipped', 'delivered'] } } },
      { $unwind: '$items' },
      {
        $group: {
          _id: '$items.productId',
          productName: { $first: '$items.name' },
          totalSold: { $sum: '$items.quantity' },
          totalOrders: { $count: {} }
        }
      },
      { $sort: { totalSold: -1 } },
      { $limit: limit },
      {
        $lookup: {
          from: 'products',
          localField: '_id',
          foreignField: '_id',
          as: 'productDetails'
        }
      },
      {
        $project: {
          productName: 1,
          totalSold: 1,
          totalOrders: 1,
          currentStock: { $arrayElemAt: ['$productDetails.stock', 0] },
          category: { $arrayElemAt: ['$productDetails.category', 0] }
        }
      }
    ]);

    res.json(results);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// ✅ AGGREGATION EXAMPLE #4: Low Stock Alert (Products sold vs remaining)
router.get('/low-stock-analysis', adminAuth, async (req, res) => {
  try {
    const results = await Product.aggregate([
      {
        $lookup: {
          from: 'orders',
          let: { productId: '$_id' },
          pipeline: [
            { $unwind: '$items' },
            {
              $match: {
                $expr: { $eq: ['$items.productId', '$$productId'] },
                status: { $in: ['processing', 'shipped', 'delivered'] }
              }
            },
            {
              $group: {
                _id: null,
                totalSold: { $sum: '$items.quantity' }
              }
            }
          ],
          as: 'salesData'
        }
      },
      {
        $project: {
          name: 1,
          category: 1,
          currentStock: '$stock',
          totalSold: { $ifNull: [{ $arrayElemAt: ['$salesData.totalSold', 0] }, 0] },
          stockStatus: {
            $cond: {
              if: { $eq: ['$stock', 0] },
              then: 'OUT_OF_STOCK',
              else: {
                $cond: {
                  if: { $lt: ['$stock', 10] },
                  then: 'LOW_STOCK',
                  else: 'OK'
                }
              }
            }
          }
        }
      },
      { $match: { stockStatus: { $in: ['LOW_STOCK', 'OUT_OF_STOCK'] } } },
      { $sort: { currentStock: 1 } }
    ]);

    res.json(results);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// ✅ AGGREGATION EXAMPLE #5: Order Status Summary
router.get('/order-status-summary', adminAuth, async (req, res) => {
  try {
    const results = await Order.aggregate([
      {
        $group: {
          _id: '$status',
          count: { $count: {} },
          orders: { $push: { orderNumber: '$orderNumber', total: '$total', createdAt: '$createdAt' } }
        }
      },
      {
        $project: {
          status: '$_id',
          count: 1,
          recentOrders: { $slice: ['$orders', 5] }
        }
      },
      { $sort: { count: -1 } }
    ]);

    res.json(results);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// ✅ AGGREGATION EXAMPLE #6: Products by Subcategory with Stock Stats
router.get('/products-by-subcategory', adminAuth, async (req, res) => {
  try {
    const results = await Product.aggregate([
      {
        $group: {
          _id: {
            category: '$category',
            subcategory: '$subcategory'
          },
          totalProducts: { $count: {} },
          totalStock: { $sum: '$stock' },
          avgStock: { $avg: '$stock' },
          outOfStock: {
            $sum: { $cond: [{ $eq: ['$stock', 0] }, 1, 0] }
          },
          lowStock: {
            $sum: { $cond: [{ $and: [{ $gt: ['$stock', 0] }, { $lt: ['$stock', 10] }] }, 1, 0] }
          }
        }
      },
      {
        $project: {
          category: '$_id.category',
          subcategory: '$_id.subcategory',
          totalProducts: 1,
          totalStock: 1,
          avgStock: { $round: ['$avgStock', 2] },
          outOfStock: 1,
          lowStock: 1,
          healthScore: {
            $round: [
              {
                $multiply: [
                  { $divide: [{ $subtract: ['$totalProducts', '$outOfStock'] }, '$totalProducts'] },
                  100
                ]
              },
              2
            ]
          }
        }
      },
      { $sort: { category: 1, subcategory: 1 } }
    ]);

    res.json(results);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// ✅ AGGREGATION EXAMPLE #7: Customer Order History (for logged-in users)
router.get('/customer-insights', adminAuth, async (req, res) => {
  try {
    const results = await Order.aggregate([
      { $match: { user: { $exists: true, $ne: null } } },
      {
        $group: {
          _id: '$user',
          totalOrders: { $count: {} },
          totalSpent: { $sum: 1 }, // Would need to parse total field for actual sum
          averageOrderValue: { $avg: 1 },
          lastOrderDate: { $max: '$createdAt' },
          statuses: { $push: '$status' }
        }
      },
      {
        $lookup: {
          from: 'users',
          localField: '_id',
          foreignField: '_id',
          as: 'userInfo'
        }
      },
      {
        $project: {
          userName: { $arrayElemAt: ['$userInfo.name', 0] },
          userEmail: { $arrayElemAt: ['$userInfo.email', 0] },
          totalOrders: 1,
          lastOrderDate: 1,
          completedOrders: {
            $size: {
              $filter: {
                input: '$statuses',
                as: 'status',
                cond: { $eq: ['$$status', 'delivered'] }
              }
            }
          }
        }
      },
      { $sort: { totalOrders: -1 } },
      { $limit: 20 }
    ]);

    res.json(results);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;