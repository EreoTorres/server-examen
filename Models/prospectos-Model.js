module.exports = {
    getProspectos: function (filtro) {
        var sql = ''

        if(filtro && filtro != ''){
            sql = " WHERE b.nombre = '"+filtro+"'"
        }

        return new Promise((resolve, reject) => {
            connectionapp.query(
                'SELECT a.*,b.nombre as estatus,b.color '+
                'FROM prospectos a '+
                'INNER JOIN estatus b ON a.idestatus = b.id' + sql
            ,async function (error, results, fields) {
                resolve(results)
            })
        });
    },
    getDocumentos:function (id){
        return new Promise((resolve, reject) => {
            connectionapp.query(
                'SELECT * FROM documentos WHERE idprospecto = '+id
            ,async function (error, resuldoc, fields) {
        
                resolve(resuldoc)
            })
        });
    },
    setProspecto: function (prospecto) {
        return new Promise((resolve, reject) => {
            if(!prospecto.sApellido){
                prospecto.sApellido = ''
            }

            if(prospecto.estatus == 1){
                connectionapp.query(
                    'INSERT INTO prospectos SET ?'
                ,{
                    nombre: prospecto.nombre,
                    pApellido: prospecto.pApellido,
                    sApellido: prospecto.sApellido,
                    calle: prospecto.calle,
                    numero: prospecto.numero,
                    colonia:  prospecto.colonia,
                    cp:  prospecto.cp,
                    telefono: prospecto.telefono,
                    rfc: prospecto.rfc,
                    observaciones: '',
                    idestatus: prospecto.estatus,
                }
                ,async function (error, results, fields) {
                    resolve(results)
                })
            }else{
                connectionapp.query(
                    'UPDATE prospectos SET observaciones = ?,idestatus = ? WHERE (id = ?)'
                ,[
                    prospecto.observaciones,
                    prospecto.estatus,
                    prospecto.id
                ]
                ,async function (error, results, fields) {
                    resolve(results)
                })
            }
        })
    },
    saveFile: function (file,idprospecto){
        return new Promise((resolve, reject) => {
            var path = './public/docs/'+idprospecto+'/'+file.nombredoc+'-'+idprospecto+'.'+file.formato

            fs.writeFile(path, file.base64, 'base64', 
                error => {
                if (error) {
                    throw error;
                } else {
                    connectionapp.query(
                        'INSERT INTO documentos SET ?'
                    ,{nombre: file.nombredoc,direccion: path,idprospecto: idprospecto,formato: file.formato}
                    ,async function (error, results, fields) {
                        resolve(results)
                    })

                }
            });
        });
    },
  };
