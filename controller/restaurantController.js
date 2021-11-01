import restaurantsModel from "../models/restaurants.js";
import fetch from "node-fetch";

export function getCuisines(req, res) {
  const latitude = req.body.latitude;
  const longitude = req.body.longitude;
  const areaIdLink = process.env.AREA_ID_LINK;

  const url = `${areaIdLink}/${latitude}/${longitude}/4`;
  fetch(url)
    .then((data) => data.json())
    .then((data) => {
      const id = data?.result?.aid;
      var aggregationPipeline = [
        {
          $match: {
            areas: {
              $elemMatch: {
                id: id,
              },
            },
            status: "OPEN",
          },
        },
        {
          $project: {
            _id: 0,
            cuisineString: 1,
          },
        },
      ];
      restaurantsModel.aggregate(aggregationPipeline).exec((error, data) => {
        const cuisines = new Set();
        if (data === null) {
          res.status(400).send({
            response: null,
          });
        }
        if (data) {
          data.map((resp) => {
            var splitCuisine = resp.cuisineString.split(",");
            splitCuisine.forEach((food) => cuisines.add(food.trim()));
          });
          res.send({
            response: {
              cuisine: Array.from(cuisines),
              id: id,
            },
          });
        }
      });
    });
}

export function getRestaurants(req, res) {
  const id = Number(req.body.id);
  const chosenCuisines = req.body.chosenCuisines.split(",");
  if (id === null || chosenCuisines === null){
    res.status(400).send({
      response: null,
    });
  }
  const aggregationPipeline = [
    {
      $match: {
        areas: {
          $elemMatch: {
            id: id,
          },
        },
        status: "OPEN",
        cuisines: {
          $elemMatch: {
            name: {
              $in: chosenCuisines,
            },
          },
        },
      },
    },
    {
      $project: {
        _id: 0,
        id: 1,
      },
    },
  ];
  restaurantsModel.aggregate(aggregationPipeline, (error, data) => {
    if (data === null || data.length < 1 || error) {
      res.status(400).send({
        response: null,
      });
    }
    if (data) {
      res.send({
        response: data.map((ids) => ids.id),
      });
    }
  });
}

export function getRestaurantsById(req, res) {
  const id = Number(req.body.id);
  const aggregationPipeline = [
    {
      $match: {
        id: id,
      },
    },
    {
      $project: {
        _id: 0,
        id: 1,
        logo: 1,
        name: 1,
        heroImage: 1,
        mostSellingItems: {
          name: 1,
          image: 1,
        },
        description: 1
      },
    },
  ];
  restaurantsModel.aggregate(aggregationPipeline, (error, data) => {
    if (data === null || data.length < 1 || error) {
      res.status(400).send({
        response: null,
      });
    }
    if (data.length > 0) {
      res.send({
        response: data[0],
      });
    }
  });
}

export function getRestaurantBranchLink(req, res) {
  let latitude = req.body.latitude;
  let longitude = req.body.longitude;
  let restaurantId = req.body.restaurantId;
  let valuesPresent = latitude && longitude && restaurantId;
  if (valuesPresent) {
    let data = {
      CountryId: 4,
      latitude: latitude,
      longitude: longitude,
      restaurantId: restaurantId,
    };
    let url = process.env.SLUG_AND_AREA_LINK;
    let options = {
      method: "POST",
      body: JSON.stringify(data),
      headers: {
        "content-type": "application/json",
      },
    };
    fetch(url, options)
      .then(async (data) => data.json())
      .then((data, err) => {
        if (data) {
          let branchId = data?.result?.branchInfo?.branchId;
          let slug = data?.result?.address?.sl;
          let areaId = data?.result?.address?.aid;
          let finalLink = process.env.FINAL_LINK;

          if (branchId < 1) {
            res.send({ response: null });
          }
          if (branchId > 1) {
            let link = `${finalLink}/${branchId}/${slug}?aid=${areaId}`;
            res.send({ response: link });
          }
        }
        if (err) {
          res.status(400).send("Error occured");
        }
      });
  }
  if (!valuesPresent) {
    res.status(400).send("Some Data missing");
  }
}
