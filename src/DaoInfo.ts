import { utils, providers, Contract, BigNumber } from "ethers";
import ERC20 from "./ERC20";
import Proposal from "./Proposal";
import WyvernDao from "./WyvernDao";
const {formatUnits , commify} = utils;

const provider : providers.Provider = new providers.JsonRpcProvider(); // localhost:8545

// Addresses
const WyvernDaoTreasuryAddress = "0xa839D4b5A36265795EbA6894651a8aF3d0aE2e68";

// Contracts
const dao = new WyvernDao(provider);
const treasury = async () => new Contract(WyvernDaoTreasuryAddress, "", provider);
const dai = new ERC20(provider, "0x6b175474e89094c44da98b954eedeac495271d0f");
const wyv = new ERC20(provider, "0x056017c55ae7ae32d12aef7c679df83a85ca75ff");

// Balances
const ethBalance = async () => provider.getBalance(await WyvernDaoTreasuryAddress);
const daiBalance = async () => await dai.contract.balanceOf(WyvernDaoTreasuryAddress);
const wyvBalance = async () => await wyv.contract.balanceOf(dao.address);

// Proposals

const proposals = async () => {
    const numProposals = (await dao.contract.numProposals()).toNumber();
    const idxs = [...Array(numProposals).keys()];
    const proposalsP : Promise<any>[] = idxs.map((i) => dao.contract.proposals(i));

    return (await Promise.all(proposalsP)).map((props) => new Proposal(props));
}

// Formatting
const displayBig = (x : BigNumber, decimals = 18) => commify(formatUnits(x, decimals));


const DaoInfo = async () => ({
    treasury: {
        ethBalance: displayBig(await ethBalance()),
        daiBalance: displayBig(await daiBalance()),
    },
    dao: {
        wyvBalance: displayBig(await wyvBalance()),
        proposals: await proposals() ,
    },
});
export default DaoInfo;