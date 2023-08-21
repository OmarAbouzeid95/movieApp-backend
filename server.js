// changes to the file
const express = require('express')
const cors = require('cors')
require("dotenv").config()
const {getDb, dbConnect} = require('./db')
const app = express()


app.use(cors({origin: 'https://omarabouzeid95.github.io/'}))
app.use(express.json())

const port = process.env.PORT || 6900;
app.listen(port, () => {
    console.log(`Now listening to port ${port}`)
})

let db
dbConnect((error) => {
    if(!error) {
        db = getDb()
        console.log(db)
    }   
})

// Searching for email and password
app.post('/signIn', (req,res) => {
    
    const user = req.body

    db.collection('users')
    .findOne({email: user.email, password: user.password})
    .then(user => {
        res.status(200).json(user)
    })
    .catch(error => {
        res.status(500).json({error: 'user not found'})
    })
})

// creating a new user
app.post('/signUp', (req,res) => {

    const user = req.body

    db.collection('users')
    .insertOne(user)
    .then(() => {
        res.status(200).json({result: 'success'})
    })
    .catch(error => {
        res.status(500).json({error: "Couldn't add user to db"})
    })
})

// Checking if email exists
app.get('/user/:email', (req,res) => {

    const userEmail = req.params.email

    db.collection('users')
    .findOne({email: userEmail})
    .then(user => {
        res.status(200).json(user)
    })
    .catch(error => {
        res.status(500).json({error: "Couldn't fetch user: " + error})
    })
})

// Checking if name exists
app.get('/user/:name', (req,res) => {

    const userName = req.params.name

    db.collection('users')
    .findOne({firstName: userName})
    .then(user => {
        res.status(200).json(user)
    })
    .catch(error => {
        res.status(500).json({error: "Couldn't fetch user: " + error})
    })
})

// updating user info
app.patch('/updateUser', (req,res) => {

    db.collection('users')
    .updateOne({email: req.body.oldEmail}, {$set: {
        email: req.body.email,
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        password: req.body.password
    }})
    .then(() => {
        res.status(200).json({result: 'success'})
    }) 
    .catch(error => {
        res.status(500).json({result: 'failed'})
    })
})

// fetching movie reviews from the DB
app.get('/movies/:id', (req,res) => {

    const movieId = parseInt(req.params.id)
    db.collection('movies')
    .findOne({movie_id: movieId})
    .then(movie => {
        res.status(200).json(movie)
    })
    .catch(error => {
        res.status(500).json({error: "Couldn't fetch movie reviews"})
    })
})

// adding movie details (rating and reviews)
app.post('/movies', (req,res) => {

    const body = req.body
    const rating = parseInt(body.ratingTotal)
    db.collection('movies')
    .insertOne({
        movie_id: body.movie_id,
        rating: rating,
        ratingCount: parseInt(body.ratingCount),
        ratingTotal: parseInt(body.ratingTotal),
        reviews: body.reviews
    })
    .then(() => {
        res.status(200).json({result: 'success'})
    })
    .catch(error => {
        res.status(500).json({result: 'error'})
    })
})

// updating movie details using PATCH
app.patch('/movies', (req,res) => {

    const id = req.body.id
    db.collection('movies')
    .updateOne({movie_id: id}, {$set: req.body.updates})
    .then(() => {
        res.status(200).json({result: 'successfuly updated'})
    })
    .catch(error => {
        res.status(500).json({result: "error: " + error})
    })
})

// test branch changes
