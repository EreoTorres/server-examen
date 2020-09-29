var express = require('express');
var router = express.Router({ mergeParams: true });
var prospectosModel =  require('../Models/prospectos-Model.js');

router.post('/getProspectos',function(req, res, next) {
    prospectosModel.getProspectos(req.body.filtro).then(async function(results) {
        if(results){
            res.setHeader("Content-Type", "application/json");
            res.json({codigo: 200,resultado: await getDocumentos(results)});
            res.end();    
        }else{
            res.setHeader("Content-Type", "application/json");
            res.json({codigo: 0,mensaje: "No se encontraron prospectos"});
            res.end(); 
        }
    }).catch((err) => console.log(err));
});

router.post('/setProspecto',async function(req, res, next) {
    prospectosModel.setProspecto(req.body).then(function(results) {
        if(results){
            if(req.body.estatus == 1){
                if(!fs.existsSync('./public/docs/'+results.insertId)){
                    fs.mkdir('./public/docs/'+results.insertId, {recursive: true}, err => {});
                }
        
                for(let datos of req.body.documentos){
                    prospectosModel.saveFile(datos,results.insertId);
                }
            }
    
            res.setHeader("Content-Type", "application/json");
            res.json({codigo: 200,mensaje: 'Prospecto registrado'});
            res.end(); 
        }else{
            res.setHeader("Content-Type", "application/json");
            res.json({codigo: 0,mensaje: 'Problemas al registrar'});
            res.end(); 
        }
    }).catch((err) => console.log(err));
});

router.get('/showdoc/:idprospecto/:nombredoc/:formato', function(req, res, next) {
    const filePath = './public/docs/'+req.params.idprospecto+'/'+req.params.nombredoc+'-'+req.params.idprospecto+'.'+req.params.formato

    fs.readFile(filePath, function(err, data) {
      if (err){
        throw err;
      }else{
        //res.writeHead(200, {'Content-Type': 'image/png'});
        res.end(data); // Send the file data to the browser.
      }
    });
});


async function getDocumentos(prospectos){
    var prospectosJSON = []

    for( let datos of prospectos){
        var docss = await prospectosModel.getDocumentos(datos.id).then(function(docs){
            return {prospecto: datos,documentos: docs}
        });

        prospectosJSON.push(docss)
    }

    return prospectosJSON
}

module.exports = router;
