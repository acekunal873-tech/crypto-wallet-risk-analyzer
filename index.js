process.loadEnvFile();
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
let riskScore = 0
let  foundSuspicious = false
knownScamAddresses.push("0x4838b106fce9647bdf1e7877bf73ce8b0bad5f97")
let historyfrom = historydata.result
for(let i = 0; i < historyfrom.length ; i++) {
let historyval = Number(historyfrom[i].value)
let historydivide = historyval / 1e18
if(historyfrom[i].isError === "1") {
failedcount++
}
totaleth += historydivide
if(historydivide > 0.01) {
    largeTxCount++
}
let currentReceiver = historyfrom[i].to;
let normalizedReceiver = currentReceiver.toLowerCase()
let currentAddress = historyfrom[i].from
let normalizedSender = currentAddress.toLowerCase()
if(currentAddress in addressCounts) {
    addressCounts[currentAddress]++
} else {
    addressCounts[currentAddress] = 1
}
 if ((knownScamAddresses.includes(normalizedSender) || knownScamAddresses.includes(normalizedReceiver)) && foundSuspicious === false ) {
    console.log("Known suspicious address found!")
        riskReasons.push("Known suspicious address matched in sender or receiver");
        riskScore += 40;
        foundSuspicious = true
}
}
let multiply = historyfrom.length === 0 ? 0 : (failedcount / historyfrom.length) * 100
let parsed = null;
let eth = null
try{
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
 eth = Number(wei) / 1e18
} catch(error)  {
      console.log("Balance failed:", error.message);
}
try {
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
 parsed = parseInt(test.result,16)
}
 catch(error) {
        console.log("Nonce failed:", error.message);
 }
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
    }
}
if (riskScore >= 51) {
    riskLevel = "High"
}
 else if(riskScore >= 21 ) {
riskLevel = "Medium"
}
else {
     riskLevel = "Low"
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
console.log("ETH Balance:",eth === null? "Unavailable" : eth + " ETH")
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
// Practicing Git diff
// Practicing Git branches
// Practicing Git brancheszdssd
// Practicing Git brancheszdssdfdssdfgit switch main