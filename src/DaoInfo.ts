import { utils, providers, Contract, BigNumber } from "ethers";
import { keccak256 } from "./HashTools";
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

// Votes

const allVotes = async () => {
    return await dao.contract.queryFilter(dao.contract.filters.Voted());
}

// Proposals
const debatePeriodInMinutes : Promise<number> = dao.contract.debatingPeriodInMinutes().then((x : BigNumber) => x.toNumber());

const proposals = async () => {
    const votesP = allVotes(); // May be slow.
    const numProposals = (await dao.contract.numProposals()).toNumber();
    const idxs = [...Array(numProposals).keys()];
    const proposalsP : Promise<any>[] = idxs.map((i) => dao.contract.proposals(i));
    const voteCounts = await Promise.all(idxs.map((i) => dao.contract.countVotes(i)));
    const proposals = (await Promise.all(proposalsP)).map((props, idx) => new Proposal(idx, props));
    proposals.forEach((p, i) => p.addVoteCount(voteCounts[i]));
    const votes = await votesP;
    votes.forEach((event) => {
        const propIdx = event.args!.proposalID.toNumber();
        const position = event.args!.position;
        const voter = event.args!.voter;
        proposals[propIdx].registerVote(propIdx, position, voter);
    })
    return proposals;
}


// Formatting
const displayBig = (x : BigNumber | undefined, decimals = 18) => commify(formatUnits(x ? x : 0, decimals));

let props : Proposal[];
let votes : providers.Log[]

class DaoInfo {
    public data = {
        treasury : {},
        dao: {
            wyvBalance: "",
            proposals: props,
            minimumQuorum: BigNumber.from(0),
            requiredToBeBoardMember: "",
            debatePeriodInDays: 0,
            votes: votes,
        }
    };

    public async init() {
        this.data = {
            treasury: {
                ethBalance: displayBig(await ethBalance()),
                daiBalance: displayBig(await daiBalance()),
            },
            dao: {
                wyvBalance: displayBig(await wyvBalance()),
                proposals: await proposals(),
                minimumQuorum: await dao.contract.minimumQuorum(), // In WYV tokens, 18 decimals.
                requiredToBeBoardMember: displayBig(await dao.contract.requiredSharesToBeBoardMember()),
                debatePeriodInDays: (await debatePeriodInMinutes) / (60 * 24),
                votes: await allVotes(),
            },
        }
    }

    public openProposals() {
        return this.data.dao?.proposals.filter((p) => !p.finalized);
    }

    public async proposalStatus(prop: number | Proposal, transactionCalldata? : string) {
        async function addressLookup(address : string) {
            const ensName = await provider.lookupAddress(address);
            return ensName === null ? address : ensName;
        }
        let p : Proposal;
        if (typeof prop === 'number') {
            p = this.data!.dao!.proposals[prop];
        } else {
            p = prop;
        }
        const yea = p.votesCount?.yea;
        const nay = p.votesCount?.nay;
        const deadline = p.votingDeadline;
        const currentQuorum = yea!.add(nay!);
        let status = {
            percentOfQuorum: displayBig(currentQuorum.mul(1000).div(this.data.dao.minimumQuorum), 1),
            remainingToQuorum: displayBig(this.data.dao.minimumQuorum.sub(currentQuorum)),
            deadline: new Date(deadline.toNumber() * 1000),
            calldata: "",
            calldataChecksOut: undefined as boolean | undefined,
            votesFor: (await Promise.all(p.votes.filter((v) => v.inSupport).map((v : {voter: string, inSupport : boolean}) => addressLookup(v.voter)))).sort(),
            votesAgainst: (await Promise.all(p.votes.filter((v) => !v.inSupport).map((v : {voter: string, inSupport : boolean}) => addressLookup(v.voter)))).sort(),
            proposal: p
        }

        if (transactionCalldata) {
            const digest = keccak256(p.recipient, { val: p.amount, length: 32 }, transactionCalldata);
            if (p.proposalHash === digest)  {
                status.calldataChecksOut = true;
                status.calldata = transactionCalldata;
            } else status.calldataChecksOut = false;
        }
        return status;
    }
};

export default DaoInfo;