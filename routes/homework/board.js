const express = require('express');
const router = express.Router();
var csvWorking =  require('./csvWorking')




router.get('/',async(req,res)=>{

await csvWorking.loadBoardJsonToCsv(req.query.id).catch((msg)=>{
    res.send(msg)
}).then((json)=>{
    res.send(json.contents)
})


})
router.post('/',async(req,res)=>{
    console.log(req.body)
    
    
    await csvWorking.saveBoardInCsv(req.body).catch((msg)=>{
        res.send(msg)
    })
    res.send("저장성공했습니다.")
    
    })
router.put('/',async(req,res)=>{

   await csvWorking.modifyBoardInCsv(req.body).catch((msg)=>{
        res.send(msg)
    })
    res.send("수정성공했습니다.")


})

router.delete('/',async(req,res)=>{

    await csvWorking.deleteBoardInCsv(req.body).catch((msg)=>{
        res.send(msg)
    })
    res.send("삭제성공했습니다.")
})


module.exports = router;