const express = require('express');
const playerRouter = express.Router();
const Player = require('../models/Player');

const playerObject = (body) => {
    const player = {
       name: body.name,
       active: true,
       position: body.position
    }
    body.phoneNumber ? player.phoneNumber = body.phoneNumber : player.phoneNumber = "";

    body.addressOne ? player.addressOne = body.addressOne : player.addressOne = "";

    body.addressTwo ? player.addressTwo = body.addressTwo : player.addressTwo = "";

    body.postcode ? player.postcode = body.postcode : player.postcode = "";

    body.photo ? player.photo = body.photo : player.photo = "";

    body.information ? player.information = body.information : player.information = "";

    return player;
}

validateRequest = (body) => {
    if (!body.name || !body.position) {
        res.sendStatus(400);
    };
}

playerRouter.param('playerId', async (req, res, next, playerId) => {
    try {
        const player = await Player.findOne({_id: playerId});
        if (player) {
            next();
        } else {
            res.sendStatus(404);
        }
    } catch(err) {
        next(err)
    } 
});

playerRouter.get('/', async (req, res, next) => {
    try {
        const players = await Player.find();
        res.json(players);
    } catch(err) {
        next(err);
    }
});

playerRouter.get('/:playerId', async (req, res, next) => {
    try {
        const player = await Player.findOne({_id: req.params.playerId});
        res.json(player);
    } catch(err) {
        next(err);
    }
});

playerRouter.post('/', async (req, res, next) => {
    const player = new Player (playerObject(req.body));
    
    try {
        const savedPlayer = await player.save();
        res.json(savedPlayer);
    } catch (err) {
        next(err);
    }; 
});

playerRouter.put('/:playerId', async (req, res, next) => {
    validateRequest(req.body);
    try {
        const updatePlayer = await Player.updateOne(
            {_id: req.params.playerId},
            {
                $set: playerObject(req.body)
            }
        );
        const updatedPlayer = await Player.findOne({_id: req.params.playerId});
        res.json(updatedPlayer);
    } catch(err) {
        next(err);
    }
});

playerRouter.delete('/:playerId', async (req, res, next) => {
    try {
        const deletedPlayer = await Player.deleteOne({_id: req.params.playerId});
        res.status(204).json(deletedPlayer);
    } catch(err) {
        next(err);
    }
});



module.exports = playerRouter;