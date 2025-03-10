

exports.handlePSQLErrors = (error, request, response, next) => {
    if (error.code === '22P02') { 
        response.status(400).send({ msg: 'Bad Request' });
    } else if (error.code === '23503') { 
        response.status(404).send({ msg: 'Not Found'})
    }
         else {
        next(error);
    }
};

exports.handleCustomErrors = (error, request, response, next) => {
    if (error.status && error.msg) {
        response.status(error.status).send({ msg: error.msg });
    } else {
        next(error);
    }
};

exports.handleServerErrors = (error, req, res, next) => {
    console.error(error); 
    response.status(500).send({ msg: 'Internal Server Error' });
};
