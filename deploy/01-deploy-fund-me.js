// function deployFunc() {
//     console.log("hello")
// }

const { network } = require("hardhat")
const {
    networkConfig,
    developmentChains,
    DECIMALS,
} = require("../helper-hardhat-config")
const { verify } = require("../utils/verify")

// if network A addrres A
// if network B address B

// if contract doesn't exist, deploy minimal version for our local testing

// module.exports.default = deployFunc
// module.exports = async (hre) => {
// const {getNamedAccounts, deployments} = hre
// hre.getNamedAccounts
module.exports = async ({ getNamedAccounts, deployments }) => {
    const { deploy, log } = deployments
    const { deployer } = await getNamedAccounts()
    const chainId = network.config.chainId
    const ethUsdPriceFeed = networkConfig[chainId]["ethUsdPriceFeed"]
    console.log(networkConfig[chainId]["ethUsdPriceFeed"])
    //when want to change chains?
    let ethUsdPriceFeedAddress
    // console.log(network.config.chainId)

    if (developmentChains.includes(network.name)) {
        const ethUsdAggregator = await deployments.get("MockV3Aggregator")
        ethUsdPriceFeedAddress = ethUsdAggregator.address
    } else {
        ethUsdPriceFeedAddress = ethUsdPriceFeed
        // console.log(`que pucha ${network.config.chainId}`)
        // console.log(typeof chainId)
        // console.log(`aqui hay`)
        // log(DECIMALS)
        // log("aqui")
    }

    log("----------------------------------------------------")
    log("Deploying FundMe and waiting for confirmations...")

    //when going local host we want to use a mock
    const args = [ethUsdPriceFeedAddress]

    const fundMe = await deploy("FundMe", {
        from: deployer,
        args: args, // put price feed address
        log: true,
        waitConfirmations: network.config.blockConfirmations || 1,
    })
    if (
        !developmentChains.includes(network.name) &&
        process.env.ETHERSCAN_API_KEY
    ) {
        await verify(fundMe.address, args)
    }
    log("----------------------------------------")
}
module.exports.tags = ["all", "fundme"]
