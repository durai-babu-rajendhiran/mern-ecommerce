exports.errorResponse = function (Message, response) {
    response.status(400).send({
        status: false,
        message: Message,
    });
}

exports.successResponse = function (Data, response) {    
    response.json({
        status: true,
        data: Data,
    })
}