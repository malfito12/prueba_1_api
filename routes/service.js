var express = require('express');
var router = express.Router();
//cambio para patch
var USEROBJ = require('../routes/databases/users')
var KEYS= USEROBJ.keys;
var USER=USEROBJ.USER;
//
var BOOK = require('../routes/databases/books')
var crypto= require('crypto')
var jwt= require('jsonwebtoken')
const keycypher ='passowrd123456'

function verytoken(req,res,nest){
  const header = req.headers['authorization'];
  if(header==null){
    res.status(300).json({
      'msn':'no tiene el permiso'
    })
    return
  }
  req.token=header;
  jwt.verify(req.token, keycypher,(err, authData)=>{
    if(err){
      res.status(403).json({
        'msn':'Token incorrecto'
      })
      return;
    }
    res.status(403).json(authData)
  })
}

/* GET home page. */
router.get('/', function(req, res, next) {
  res.status(200).json({
    'msm': 'hola alex'
  })
});

router.post('/login',(req,res,next)=>{
  var params =req.body;
  var passwordcyper = crypto.createHash('md5').update(params.password).digest('hex')
  USER.find({email: params.email, password: passwordcyper}).exec((err,docs)=>{
    if(err){
      res.status(300).json({
        'msn':'error en la base de datos'
      })
      return;
    }
    if(docs.length == 0){
      res.status(300).json({
        'msn':'Usuario y passowrd Incorrecto'
      })
      return;
    } else {
      //creacion del token
      jwt.sign({name: params.email, password: passwordcyper}, keycypher,(err,token)=>{
        if(err){
          res.status(300).json({
            'msn':'error con jwt'
          })
          return;
        }
        res.status(200).json({
          'msn':'autenticacion exitosa',
          'token': token
        })
        return;
      })
    }
  })
})

router.post('/user',function(req, res, next){
  var datos = req.body;
  if(datos.password ==null){
    res.status(300).json({
      'msm':'no riene el password'
    })
    return;
  }
  //hash de password
  datos.password =crypto.createHash('md5').update(datos.password).digest('hex')
  var user = new USER(datos);
  user.save().then(()=>{
    res.status(200).json({"msm": "usuario insertado"});
  });
});

router.get('/user', (req,res)=>{
  let params =req.query;
  let SKIP = 0;
  let LIMIT = 10;
  if(params.skip){
    SKIP=parseInt(params.skip)
  }
  if(params.limit){
    LIMIT=parseInt(params.limit)
  }
  USER.find({}).skip(SKIP).limit(LIMIT).exec((err,docs)=>{
    if(err){
      res.status(404).json({'msn':'error en la lase de datos'})
      return;
    }
    res.status(200).json(docs)
  })
})

router.get('/user/:id',async(req,res)=>{
  const not = await USER.findById(req.params.id)
  res.json(not)
})

router.patch('/user',(req,res,next)=>{
  var data= req.body;
  var params= req.query;
  if(params.id== null){
    res.status(300).json({
      "msn":"faltan parametros"
    })
    return
  }
  var objkeys= Object.keys(data);
  for (var i=0; i<objkeys.length;i++){
      if(!checkKeys(objkeys[i])){
        res.status(300).json({
          "msn":"tus parametos son incorrectos "+objkeys[i]
        })
        return
      }
  }
  USER.update({_id: params.id},data).exec((err,docs)=>{
    res.status(300).json(docs)
  })

})
const checkKeys=(key)=>{
    for(var j=0; j<KEYS.length;j++){
      if(key==KEYS[j]){
        return true
      }
    }
    return false
}

// router.delete('/user/:id', (req,res)=>{
//   var datos = req.query;
//   if(datos.id== null){
//     res.status(300).json({
//       'msn':'faltan parametros'
//     })
//     return
//   }
//   USER.remove({_id: datos.id},(err,docs)=>{
//     if(err){
//       res.status(300).json({
//         'msn':'no se pudo borrar el usuario'
//       })
//       return
//     }
//     res.status(300).json(docs)
//   })
// })

router.delete('/user/:id',async(req,res)=>{
  const not=await USER.findByIdAndDelete(req.params.id)
  res.json({message:'usuario eliminado'})
})

//BOOKS
router.get('/book', async(req,res)=>{
  const data= await BOOK.find()
  res.json(data)
})

router.post('/book',async(req,res)=>{
  const {name,author,cant} =req.body;
  const data=new BOOK({
    name,
    author,
    cant
  })
  await data.save();
  res.json({message: 'libro guardado'})
})

router.delete('/book/:id', async(req,res)=>{
  const data =await BOOK.findByIdAndDelete(req.params.id)
  res.json({message:'libro eliminado'})
})

router.put("/book/:id",async(req,res)=>{
  const{name}=req.body;
  await BOOK.findOneAndUpdate({_id:req.params.id},{
    name:name
  })
  res.json({message:'libro modificado'})
})

module.exports = router;
