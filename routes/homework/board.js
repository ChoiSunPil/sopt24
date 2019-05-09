const express = require('express');
const router = express.Router();
const  csvWorking =  require('./csvWorking')
const path = require('path')
const modulePath = path.join(__dirname,'../../module')
const  utils = require(path.join(modulePath,'/utils'))
const statusCode = require(path.join(modulePath,'/statusCode'))
const responseMessage = require(path.join(modulePath,'/responseMessage')) 




router.get('/:id',async(req,res)=>{

var id = req.params.id

await csvWorking.loadBoardJsonToCsv(id).then((json)=>{
    delete json.pw
    delete json.salt
    res.send(utils.successTrue(statusCode.OK,responseMessage.SEARCH_TABLE_SUCCESS,json))
}).catch((msg)=>{
    res.send(utils.successFalse(statusCode.NO_CONTENT,msg))
})


})
router.post('/',async(req,res)=>{

    let json = req.body
    if(json.id == undefined || json.title == undefined || json.contents == undefined ||json.pw == undefined)
    res.send(utils.successFalse(statusCode.BAD_REQUEST,responseMessage.CREATED_TABLE_FAIL))




    
    await csvWorking.saveBoardInCsv(req.body).catch((msg)=>{
        if(msg ===responseMessage.CREATED_TABLE_FAIL)
        {
            res.send(utils.successFalse(statusCode.INTERNAL_SERVER_ERROR,msg))
        }
        else
        {
            res.send(utils.successFalse(statusCode.NO_CONTENT,msg))
        }
    })
    res.send(utils.successTrue(statusCode.OK,responseMessage.CREATE_TABLE_SUCCESS))
    
    })
router.put('/',async(req,res)=>{
    let json = req.body
    if(json.id == undefined || json.title == undefined || json.contents == undefined ||json.pw == undefined)
    res.send(utils.successFalse(statusCode.BAD_REQUEST,responseMessage.MODIFY_TABLE_FAIL))


   await csvWorking.modifyBoardInCsv(req.body).catch((msg)=>{
          if(msg ===responseMessage.MODIFY_TABLE_FAIL)
        {
            res.send(utils.successFalse(statusCode.INTERNAL_SERVER_ERROR,msg))
        }
        else
        {
            res.send(utils.successFalse(statusCode.NO_CONTENT,msg))
        }
    })
    res.send(utils.successTrue(statusCode.OK,responseMessage.MODIFY_TABLE_SUCCESS))


})

router.delete('/',async(req,res)=>{
    let json = req.body
    if(json.id == undefined || json.title == undefined || json.contents == undefined ||json.pw == undefined)
    res.send(utils.successFalse(statusCode.BAD_REQUEST,responseMessage.DELETE_TABLE_FAIL))

    await csvWorking.deleteBoardInCsv(req.body).catch((msg)=>{
        if(msg ===responseMessage.DELETE_TABLE_FAIL)
        {
            res.send(utils.successFalse(statusCode.INTERNAL_SERVER_ERROR,msg))
        }
        else
        {
            res.send(utils.successFalse(statusCode.NO_CONTENT,msg))
        }
    })
    res.send(utils.successTrue(statusCode.OK,responseMessage.DELETE_TABLE_SUCCESS))
})


module.exports = router;