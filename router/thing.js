import express  from "express";
const router = express.Router()

router.get('/:id([0-9]{3})',(req,res)=>{
    res.send('This is route '+req.params.id)
})
router.get('*',(req,res)=>{
    res.send("Invalid Url")
})
export default router;