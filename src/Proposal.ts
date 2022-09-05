import { ethers, BigNumber } from "ethers";

class Vote {
    public voter : string;
    public inSupport : boolean;
    constructor(voter : string, inSupport : boolean) {
        this.voter = voter;
        this.inSupport = inSupport;
    }
};

class Proposal {

    public idx: number;
    public recipient : string;
    public amount : BigNumber;
    public metadataHash : string;
    public timeCreated : BigNumber;
    public votingDeadline : BigNumber;
    public finalized : boolean;
    public proposalPassed : boolean;
    public numberOfVotes : BigNumber;
    public proposalHash : string;
    public votesCount : {yea : BigNumber, nay : BigNumber} | undefined = undefined;   
    public votes : Vote[];

    constructor(idx : number, [recipient, amount, metadataHash, timeCreated, votingDeadline, finalized, proposalPassed, numberOfVotes, proposalHash]:
        [string, BigNumber, string, BigNumber, BigNumber, boolean, boolean, BigNumber, string]) {
        this.idx = idx;
        this.recipient = recipient;
        this.amount = amount;
        this.metadataHash = metadataHash;
        this.timeCreated = timeCreated;
        this.votingDeadline = votingDeadline;
        this.finalized = finalized;
        this.proposalPassed = proposalPassed;
        this.numberOfVotes = numberOfVotes;
        this.proposalHash = proposalHash;
        this.votes = [];
    }

    public addVoteCount({ yea, nay }: { yea: BigNumber, nay: BigNumber }) {
        this.votesCount = { yea: yea, nay: nay };
    }

    public registerVote(proposalID : number, position: boolean, voter : string) {
        if (proposalID == this.idx) {
            this.votes.push(new Vote(voter, position))
        } else {
            throw Error("Wrong proposal");
        }
    }

}

export default Proposal;