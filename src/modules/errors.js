class APIError extends Error {
  constructor(name,statusCode,errorCode,message=null){
    super(message || name);
    this.name = name;
    this.statusCode = statusCode;
    this.errorCode = errorCode;
  }
}

class ResourceNotFound extends APIError {
  constructor(){
    super('ResourceNotFound',404,'RESOURCE_NOT_FOUND');
  }
}
class ResourceAlreadyExists extends APIError {
  constructor(){
    super('ResourceAlreadyExists',409,'RESOURCE_ALREADY_EXISTS');
  }
}
class RelatedResourceNotFound extends APIError {
  constructor(){
    super('RelatedResourceNotFound',404,'RELATED_RESOURCE_NOT_FOUND');
  }
}

class BadRequest extends APIError{
  constructor(){
    super('BadRequest',400,'BAD_REQUEST');
  }
}

function errorHandler(err, req, res, next) {
  console.error(err); // imprimimos el error en consola
  // Chequeamos que tipo de error es y actuamos en consecuencia
  if (err instanceof APIError){
    res.status(err.statusCode);
    res.json({status: err.statusCode, errorCode: err.errorCode});
  }else if (err.type === 'entity.parse.failed'){
    // body-parser error para JSON invalido
    res.status(err.status);
    res.json({status: 400, errorCode: 'BAD_REQUEST'});
  } else {
    // continua con el manejador de errores por defecto
    res.status(500);
    res.json({status: 500,errorCode: 'INTERNAL_SERVER_ERROR'});
    //next();
  }
}

module.exports = {
  APIError,
  ResourceNotFound,
  ResourceAlreadyExists,
  RelatedResourceNotFound,
  BadRequest,
  errorHandler 
};