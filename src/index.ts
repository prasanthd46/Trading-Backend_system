import express from "express"

const app = express()



interface Balances {
    [key:string] : number
}

interface User {
    id       : string,
    balances : Balances
}

interface Order{
    userId  : string,
    price   : number,
    quantity: number
}


export const TICKER = "GOOGLE"

const users : User[] = [{
    id:"1",
    balances:{
        "GOOGLE":10,
        "USD":5000
    }
    },{
    id:"2",
    balances:{
        "GOOGLE":10,
        "USD":5000
    } 
    }]



const bids:Order[] = []
const asks:Order[] = []

app.get("/order",(req,res)=>{
    const {side,price,quantity,userId} = req.body

    const remainingQty:number = fillOrders(side,price,quantity,userId)

    if(remainingQty == 0){
        return res.json({filledQuantity : quantity})
    }

    if(side == 'bid'){
        bids.push({
            userId,
            price,
            quantity
        })
        bids.sort((a,b) => a.price - b.price);
    }
    if(side == "ask"){
        asks.push({
            userId,
            price,
            quantity
        })
        asks.sort((a,b)=> b.price - a.price)
    }
    return res.json({filledQuantity:remainingQty})

})





function fillOrders(side:string,price:number,quantity:number,userId:string) : number {
    return 2
}
app.listen(3000,()=>{
    console.log("Listening at port : 3000")
})