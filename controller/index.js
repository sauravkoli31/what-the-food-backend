import express from 'express'
const router = express.Router()
import { getRestaurants, getCuisines, getRestaurantBranchLink, getRestaurantsById, getRestaurantData } from './restaurantController.js'


router.post('/getRestaurants', (req, res) => {
    getRestaurants(req,res)
})

router.post('/getRestaurantsById', (req, res) => {
    getRestaurantsById(req,res)
})

router.post('/getCuisines', (req, res) => {
    getCuisines(req,res)
})

router.post('/getRestaurantsBranchLink', (req, res) => {
    getRestaurantBranchLink(req, res)
})

router.post('/getRestaurantData', (req, res) => {
    getRestaurantData(req, res)
})


export default router