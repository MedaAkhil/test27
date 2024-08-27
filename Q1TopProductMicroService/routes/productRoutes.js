var express = require('express');
var router = express.Router();
const axios = require('axios');




//api route for filtering the data based on the company name and product category given by the user and top n products and the minprice of the product and the maxprice
router.get('/filter', async (req, res, next) => {
  try {
    const companyName = req.query.companyName;
    const category = req.query.category;
    const top = req.query.top;
    const minPrice = req.query.minPrice;
    const maxPrice = req.query.maxPrice;
    const authToken = req.headers.authorization;

    const url = `http://20.244.56.144/test/companies/${companyName}/categories/${category}/products?top=${top}&minPrice=${minPrice}&maxPrice=${maxPrice}`;

    const response = await axios.get(url, {
      headers: {
        'Authorization': `Bearer ${authToken}`,
        }
    });
    res.json(response.data);
  } catch (error) {
    console.error(error);
    res.status(500).send('Error fetching data');
  }
});


// api route to sort the product result based on the user req body like rating, price, discount, company
router.get('/sort', async (req, res, next) => {
  try {
    const companyName = req.query.companyName;
    const category = req.query.category;
    const sortBy = req.query.sortBy;
    const sortOrder = req.query.sortOrder || 'asc';
    const authToken = req.headers.authorization;
    const top = req.query.top;
    const minPrice = req.query.minPrice;
    const maxPrice = req.query.maxPrice;

    const url = `http://20.244.56.144/test/companies/${companyName}/categories/${category}/products?top=${top}&minPrice=${minPrice}&maxPrice=${maxPrice}`;

    const response = await axios.get(url, {
      headers: {
        'Authorization': authToken,
      }
    });

    let products = response.data;

    // Perform sorting based on the `sortBy` field
    if (sortBy) {
      products.sort((a, b) => {
        if (sortBy === 'rating' || sortBy === 'price' || sortBy === 'discount') {
          return sortOrder === 'asc' ? a[sortBy] - b[sortBy] : b[sortBy] - a[sortBy];
        } else if (sortBy === 'company') {
          return sortOrder === 'asc' ? a.company.localeCompare(b.company) : b.company.localeCompare(a.company);
        } else {
          return 0;
        }
      });
    }

    res.json(products);
  } catch (error) {
    console.error(error);
    res.status(500).send('Error fetching or sorting data');
  }
});




/* GET home page. */


router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

module.exports = router;
