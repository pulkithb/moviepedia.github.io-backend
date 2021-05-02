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
app.post('/addsearchhis',(req,res)=>{
	db('history').returning('*').insert({
		email:req.body.email,
		search:req.body.search,
		time: new Date()
	})
	.then(response =>{
		res.json(response)
	})
	.catch(err => res.status(400).json('unable to add to search history'))
})
app.get('/getfav/:email',(req,res) => {
	const {email}= req.params
	
	db.select('*').from('favourite').where('email','=',email).orderBy('sr','desc')
	.then(response => {
		res.json(response)
	})
	.catch(err=> res.status(400).json('Unable to load favourite'))

})
app.get('/getsearchhis/:email',(req,res) => {
	const {email}= req.params
	
	db.select('*').from('history').where('email','=',email).orderBy('sr','desc')
	.then(response => {
		res.json(response)
	})
	.catch(err=> res.status(400).json('Unable to load search history'))

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
app.post('/delsearchhis',(req,res) => {
	
	db('history').where(
		'sr','=',req.body.sr
		
	).del()
	.then(response => {
		res.json(response)
	})
	.catch(err=> res.status(400).json('Unable to delete search History'))
})
app.post('/clearallsearchhis',(req,res) => {
	
	db('history').where(
		'email','=',req.body.email
		
	).del()
	.then(response => {
		res.json(response)
	})
	.catch(err=> res.status(400).json('Unable to clear all search History'))
})
app.post('/addwatchhis',(req,res)=>{
	db('watchhistory').returning('*').insert({
		email:req.body.email,
		id:req.body.id,
		title:req.body.title,
		time: new Date()
	})
	.then(response =>{
		res.json(response)
	})
	.catch(err => res.status(400).json('unable to add to watch history'))
})
app.get('/getwatchhis/:email',(req,res) => {
	const {email}= req.params
	
	db.select('*').from('watchhistory').where('email','=',email).orderBy('sr','desc')
	.then(response => {
		res.json(response)
	})
	.catch(err=> res.status(400).json('Unable to load watch history'))
})
app.post('/delwatchhis',(req,res) => {
	
	db('watchhistory').where(
		'sr','=',req.body.sr
		
	).del()
	.then(response => {
		res.json(response)
	})
	.catch(err=> res.status(400).json('Unable to delete watch History'))
})
app.post('/clearallwatchhis',(req,res) => {
	
	db('watchhistory').where(
		'email','=',req.body.email
		
	).del()
	.then(response => {
		res.json(response)
	})
	.catch(err=> res.status(400).json('Unable to clear all watch History'))
})
app.listen(process.env.PORT || 3001,()=>{
    console.log('app is running')
})
