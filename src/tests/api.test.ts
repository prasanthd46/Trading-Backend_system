import {describe,expect,it} from "@jest/globals"
import app, { asks, bids, TICKER } from "../index"
import request from "supertest"

describe("Testing the APIs",()=>{
    it("verify balances",async ()=>{
        let res = await request(app).get("/balance/1").send()
        expect(res.body.balance[TICKER]).toBe(10)
        res = await request(app).get("/balance/2").send()
        expect(res.body.balance[TICKER]).toBe(10)
    })

    it("Create Order tests", async ()=>{
        await request(app).post("/order").send({
           side:"bid",
           price:1400,
           quantity:10,
           userId:"1"
        })
        await request(app).post("/order").send({
            side:"ask",
            price:1500,
            quantity:10,
            userId:"2"
        })
        await request(app).post("/order").send({
            side:"ask",
            price:1510,
            quantity:5,
            userId:"2"
        })
        let res = await request(app).get("/depth").send()
        expect(res.status).toBe(200)

        expect(res.body.depth["1510"].quantity).toBe(5)
    })
    it("balances should be same ",async ()=>{
        let res = await request(app).get("/balance/1").send()
        expect(res.body.balance[TICKER]).toBe(10)
    })
    it("order that matches test",async ()=>{
        let res = await request(app).post("/order").send({
            side:"bid",
            price:1501,
            quantity:9,
            userId:"1"
        })

        expect(res.body.filledQuantity).toBe(9)
    })
    it("Ensures orderbook updates",async()=>{
        let res  = await request(app).get("/depth").send()
        expect(res.body.depth["1500"].quantity).toBe(1)
    })
    it("Ensures balances updates",async()=>{
        let res = await request(app).get("/balance/1").send()
        expect(res.status).toBe(200)
        expect(res.body.balance[TICKER]).toBe(19)
    })
})

describe("Quote Tests",()=>{
    beforeAll(async()=>{

        bids.length=0
        asks.length=0

        await request(app).post("/order").send({
            side:"bid",
            price:1400,
            quantity:5,
            userId:"1"
        })
        await request(app).post("/order").send({
            side:"ask",
            price:500,
            quantity:5,
            userId:"2"
        })
        await request(app).post("/order").send({
            side:"ask",
            price:1500,
            quantity:5,
            userId:"2"
        })
    })
    
    it("get the quote test",async ()=>{
        let res = await request(app).get("/quote").send({
            qty:10
        })
        console.log(res.body)    
        expect(res.body.quote).toBe(1500*5)
    })
})
