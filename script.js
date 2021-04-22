const express = require('express')
const bodyParser = require('body-parser');
const cors = require('cors');
const knex = require('knex');
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
//console.log(db.select('*').from('favourite'))
app.post('/addfav',(req,res) => {
	db('favourite').returning('*').insert({
		email:req.body.email,
		id: req.body.id,
		resulttype: req.body.resultType,
		image: req.body.image,
		title: req.body.title,
		description: req.body.title
	})
	.then(response=>{
		res.json(response[0])
	})
	.catch(err=> res.status(400).json('Unable to add to favourite'))
})
app.get('/getfav/:email',(req,res) => {
	const {email}= req.params
	
	db.select('*').from('favourite').where('email','=',email)
	.then(response => {
		res.json(response)
	})
	.catch(err=> res.status(400).json('Unable to load favourite'))

})
app.post('/delfav',(req,res) => {
	db('favourite').where(
		'email','=',req.body.email
		
	).where('id','=',req.body.id).del()
	.then(response => {
		res.json(response)
	})
	.catch(err=> res.status(400).json('Unable to delete Favourite'))
})
app.listen(process.env.PORT || 3001,()=>{
    console.log('app is running')
})
