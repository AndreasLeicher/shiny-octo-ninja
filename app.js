var application_root = __dirname,
express = require("express"),
path = require("path");
mongoose = require("mongoose");


var app = express();

//connect to database
mongoose.connect("mongodb://localhost/ecomm_db");

//config
app.configure( function() {
	app.use(express.bodyParser());
	app.use(express.methodOverride());
	app.use(app.router);
	app.use(express.static(path.join(application_root, "public")));
	app.use(express.errorHandler({dumpExceptions: true, showStack: true}));
});

var Schema = mongoose.Schema;  

var Product = new Schema({  
    title: { type: String, required: true },  
    description: { type: String, required: true },  
    style: { type: String, unique: true },  
    modified: { type: Date, default: Date.now }
});

var ProductModel = mongoose.model('Product', Product);

/*
API endpoint
*/
app.get('/api', function(req, res) {
	res.send('Ecommerce API is running');
});

/*
get all available products
URL: /api/products
GET request returns all products in JSON format
*/
app.get('/api/products', function (req, res){
	console.log("received a GET request for /api/products");
	return ProductModel.find( function(err, products){
		if (!err) {
			return res.send(products);
		} else {
			return console.log(err);
		}
	});
});


/*
Create a single product with a POST request
URL: /api/products
POST: title, description, style of product.
*/
app.post('/api/products', function(req, res){
	console.log("received a POST request for /api/products");
	var product;
	console.log("POST: ");
	console.log(req.body);

	product = new ProductModel({
		title: req.body.title,
		description: req.body.description,
		style: req.body.style,
	});

	product.save(function(err){
		if (!err){
			return console.log("created");
		} else {
			return console.log(err);
		}
	});
	return res.send(product);
});


/*
Read a single product by ID
*/
app.get('/api/products/:id', function (req, res){
	console.log("received GET request for /api/products with id=" + req.params.id);
	return ProductModel.findById(req.params.id, function(err, product){
		if (!err) {
			return res.send(product);
		} else {
			return console.log(err);
		}

	})
});

/*
Update a single product by ID
*/
app.put('/api/products/:id', function(req, res){
	console.log("received POST request (update) for /api/products with id=" + req.params.id);
	return ProductModel.findById(req.params.id, function(err, product){
		product.title = req.body.title;
		product.description = req.body.description;
		product.style = req.body.style;
		return product.save(function(err){
			if (!err){
				console.log("Updated product");
			} else {
				console.log(err);
			}
			return res.send(product);
		});
	});
});




//launch server
app.listen(4242);