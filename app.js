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
	console.log("got a GET request for /api/products");
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
	console.log("got a POST request for /api/products");
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


//launch server
app.listen(4242);