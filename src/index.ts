import express from "express"

const app = express()


app.use(express.json())

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



export const bids:Order[] = []
export const asks:Order[] = []

app.post("/order",(req,res)=>{

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
        bids.sort((a,b) => b.price - a.price);
    }
    if(side == "ask"){
        asks.push({
            userId,
            price,
            quantity
        })
        asks.sort((a,b)=> a.price - b.price)
    }
    console.log(bids,asks)
    return res.json({filledQuantity:quantity - remainingQty})

})

app.get("/depth",(req,res)=>{
    const depth : {
        [price : string] :{
            type : 'bid' | 'ask',
            quantity : number 
        }
    } = {}

    for(let i=0;i<bids.length;i++){
        if(!depth[bids[i].price]){
            depth[bids[i].price] = {
                type:'bid',
                quantity:bids[i].quantity
            }
        }else{
            depth[bids[i].price].quantity += bids[i].quantity 
        }
    }
    for(let i=0;i<asks.length;i++){
        if(!depth[asks[i].price]){
            depth[asks[i].price]={
                type:'ask',
                quantity:asks[i].quantity
            }
        }else{
            depth[asks[i].price].quantity += asks[i].quantity
        }
    }
    return res.json({depth})

})
app.get("/balance/:userId",(req,res)=>{
    const userId = req.params.userId
    const user = users.find(x => x.id === userId)

    if(!user){
        return res.json({
            usd:0,
            [TICKER]:0
        })
    }

    return res.json({balance : user.balances})
})

app.get("/quote",(req,res)=>{
    const qty = req.body.qty
    let quantity = qty
    let priceSum : number = 0 
    for(let i=0;i<asks.length;i++){
        if(quantity > 0){
            if(quantity < asks[i].quantity){
                priceSum += quantity * asks[i].price 
                quantity = 0
            }else{
                priceSum += asks[i].quantity * asks[i].price
                quantity -= asks[i].quantity
            }
        }else{
            break;
        }
    }
    const quote = priceSum
    return res.json({quote,bids,asks})
})

function flipBalance(userId1:string,userId2:string,quantity:number,price:number){
    let user1 = users.find(x => x.id === userId1)
    let user2 = users.find(x => x.id === userId2)
    if(!user1 || !user2){
        return
    } 

    user1.balances[TICKER] -= quantity
    user2.balances[TICKER] += quantity
    user1.balances["USD"] += quantity*price
    user2.balances["USD"] -= quantity*price
}

function fillOrders(side:string,price:number,qty:number,userId:string) : number {
    let  quantity = qty
    if(side == "bid"){
        for(let i=0;i<asks.length;i++){
            if(price<asks[i].price){
                continue
            }
            if(quantity<asks[i].quantity){
                asks[i].quantity -= quantity
                flipBalance(asks[i].userId,userId,quantity,asks[i].price)
                return 0
            }else{
                quantity -= asks[i].quantity
                flipBalance(asks[i].userId,userId,asks[i].quantity,asks[i].price)
                asks.splice(i,1)
                i--;
            }
        }
    }else{
        for(let i=0;i<bids.length;i++){
            if(price > bids[i].price){
                continue;
            }
            if(quantity<bids[i].quantity){
                bids[i].quantity -= quantity
                flipBalance(userId,bids[i].userId,quantity,price)
                return 0
            }else{
                quantity -= bids[i].quantity
                flipBalance(userId,bids[i].userId,bids[i].quantity,price)
                bids.splice(i,1)
                i--
            }
        }
    }
    return quantity
}
app.listen(3000,()=>{
    console.log("Listening at port : 3000")
})

export default app