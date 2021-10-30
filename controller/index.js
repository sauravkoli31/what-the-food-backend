import express from 'express'
const router = express.Router()
import { getRestaurants, getCuisines, getRestaurantBranchLink } from './restaurantController.js'


router.post('/getRestaurants', (req, res) => {
    getRestaurants(req,res)
})

router.post('/getCuisines', (req, res) => {
    getCuisines(req,res)
})

router.post('/getRestaurantsBranchLink', (req, res) => {
    getRestaurantBranchLink(req, res)
})

export default router