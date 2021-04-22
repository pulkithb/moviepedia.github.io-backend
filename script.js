const express = require('express')
const bodyParser = require('body-parser');
const cors = require('cors');
const knex = require('knex');
process.env.NODE_TLS_REJECT_UNAUTHORIZED=0
const db = knex({
	client: 'pg',
	connection:{
		connectionString: process.env.DATABASE_URL,
		ssl: true
	}
}); 
const app = express();
app.use(bodyParser.json());
app.use(cors())
/*app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  next();
});*/
//console.log(db.select('*').from('favourite'))
app.post('/addfav',(req,res) => {
	res.set('Access-Control-Allow-Origin', '*');
	db('favourite').returning('*').insert({
		email:req.body.email,
		id: req.body.id,
		resulttype: req.body.resultType,
		image: req.body.image,
		title: req.body.title,
		description: req.body.title
	})
	.then(response=>{
		res.set('Access-Control-Allow-Origin', '*');
		res.json(response[0])
	})
	.catch(err=> res.status(400).json('Unable to add to favourite'))
})
app.get('/getfav/:email',(req,res) => {
	res.set('Access-Control-Allow-Origin', '*');
	const {email}= req.params
	
	db.select('*').from('favourite').where('email','=',email)
	.then(response => {
		res.set('Access-Control-Allow-Origin', '*');
		res.json(response)
	})
	.catch(err=> res.status(400).json('Unable to load favourite'))

})
app.post('/delfav',(req,res) => {
	res.set('Access-Control-Allow-Origin', '*');
	db('favourite').where(
		'email','=',req.body.email
		
	).where('id','=',req.body.id).del()
	.then(response => {
		res.set('Access-Control-Allow-Origin', '*');
		res.json(response)
	})
	.catch(err=> res.status(400).json('Unable to delete Favourite'))
})
app.listen(process.env.PORT || 3001,()=>{
    console.log('app is running')
})
