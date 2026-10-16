process.loadEnvFile();
console.log(Boolean(process.env.ETHERSCAN_API_KEY))
const ethprc = "https://ethereum-rpc.publicnode.com"
async function main() {
    const data = await fetch(ethprc,{
        method: "POST",
       headers: {
        "Content-Type": "application/json"
       },
         body: JSON.stringify({
    jsonrpc: "2.0",
    method: "eth_blockNumber",
    params: [],
    id: 1
    })
    })

    if(!data.ok) {
    throw new Error("HTTP request failed:"+ data.status)
    }

     let result = await data.json()
     if(result.error)  {
        throw new Error(result.error.message)
     }

    let latestblock = parseInt(result.result,16)
   


const walletAddress = "0xFEEEEEE44046c3f61a8CC081E0918eF0de0a7ffC";
const etherscanUrl = "https://api.etherscan.io/v2/api";


const params = new URLSearchParams({
    chainid: "1",
    module: "account",
    action: "txlist",
    address: walletAddress,
    startblock: "0",
    endblock: "99999999",
    page: "1",
    offset: 5,
    sort: "desc",
    apikey: process.env.ETHERSCAN_API_KEY
});

const url = `${etherscanUrl}?${params.toString()}`
const historyResponse = await fetch(url)
let historydata = await historyResponse.json()
if(historydata.status !== "1") {
    throw  new Error(historydata.result)
}

let failedcount = 0
let totaleth = 0
let largeTxCount = 0
let riskLevel = "Low"
let addressCounts = {}
let foundRepeated = false 
let riskReasons = []
let knownScamAddresses = []
knownScamAddresses.push("0xTEST123")




let historyfrom = historydata.result
for(let i = 0; i < historyfrom.length ; i++) {
let historyval = Number(historyfrom[i].value)
let historydivide = historyval / 1e18
console.log(`Transaction Value:${historydivide} ETH`)

if(historyfrom[i].isError === "1") {
failedcount++
}

totaleth += historydivide

console.log("From Address:",historyfrom[i].from)
console.log("To Address:",historyfrom[i].to)

if(historydivide > 0.01) {
    largeTxCount++
}


let currentAddress = historyfrom[i].from

if(currentAddress in addressCounts) {
    addressCounts[currentAddress]++
} else {
    addressCounts[currentAddress] = 1
}
 if(knownScamAddresses.includes(historyfrom[i].from)) {
    console.log("Known suspicious address found!")
        riskReasons.push("Known suspicious address matched in sender (From)")
}

 if(knownScamAddresses.includes(historyfrom[i].to)) {
    console.log("Known suspicious address found!")
 riskReasons.push("Known suspicious address matched in receiver (To)")
}


}

let multiply = (failedcount / historyfrom.length) * 100





 let response  = await fetch(ethprc,{
    method: "POST",
     headers: {
        "Content-Type": "application/json"
       },
       body: JSON.stringify({
         jsonrpc: "2.0",
    method: "eth_getBalance",
    params: [walletAddress,"latest"],
    id: 2
       })
})
 if(!response.ok) {
    throw new Error("HTTP request failed:"+   response.status)
    }
let balance = await response.json()
if(balance.error) {
    throw new Error(balance.error.message)
}
let wei = BigInt(balance.result)
let eth = Number(wei) / 1e18

let third = await fetch(ethprc,{
    method: "POST",
    headers: {
        "content-type":"application/json", 
    }, 
    body:  JSON.stringify({
              jsonrpc: "2.0",
    method: "eth_getTransactionCount",
    params: [walletAddress,"latest"],
    id: 3
    
    })

    
})
if(!third.ok) {
    throw  new Error("HTTP request failed:"+  third.status)
}
    let test = await third.json()
    if(test.error) {
        throw new Error(test.error.message)
    }
let parsed = parseInt(test.result,16)
let riskScore = 0

if(multiply >= 20) {
    riskScore += 30
    riskReasons.push("High failed transaction rate: +30 risk points")
}

if(largeTxCount >= 1) {
      riskScore += 20
      riskReasons.push("Large transactions detected: +20 risk points")
}

for(let address in addressCounts ) {
    if(addressCounts[address] >= 3) {
         riskScore += 20
         riskReasons.push("Repeated sender detected: +20 risk points")
         break;
    }
}


if(riskScore >= 21 && riskScore <= 50 ) {
riskLevel = "Medium"
}
if (riskScore >= 51 && riskScore <= 100) {
    riskLevel = "High"
}

console.log("Repeated Sender Addresses:")
for(let toss in addressCounts) {
    if(addressCounts[toss] > 1) {
        foundRepeated = true
        console.log(toss,addressCounts[toss])
    }
   
}
if(foundRepeated === false) {
    console.log("No repeated sender addresses found")
}

console.log("========== WALLET REPORT ==========")
console.log("Wallet Address",walletAddress)
console.log("Latest Block",latestblock)
console.log("ETH Balance:",eth,"ETH")
console.log("Transaction Nonce:", parsed)
console.log(`Failed Transaction Percentage: ${Math.round(multiply)}%`)
console.log("Total Transactions Analyzed:",historyfrom.length)
console.log("Total ETH Transaction Value:",totaleth)
console.log("Failed Transactions:",failedcount)
console.log("large transactions",largeTxCount)
console.log("Risk Score:",riskScore)
console.log("Risk Level:",riskLevel)
console.log("Risk Reasons:")
for(let reas of riskReasons) {
    console.log(reas)
}

console.log("===================================")







}
 
main().catch(function(er) {
    console.log("error",er.message)
})
