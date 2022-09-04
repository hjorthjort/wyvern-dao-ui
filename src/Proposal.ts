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

    public recipient : string;
    public amount : BigNumber;
    public metadataHash : string;
    public timeCreated : BigNumber;
    public votingDeadline : BigNumber;
    public finalized : boolean;
    public proposalPassed : boolean;
    public numberOfVotes : BigNumber;
    public proposalHash : BigNumber;
//  public votes : Vote[] ;
//  public voted : (address : string) => boolean;
    
    constructor([recipient, amount, metadataHash, timeCreated, votingDeadline, finalized, proposalPassed, numberOfVotes, proposalHash] :
        [string, BigNumber, string, BigNumber, BigNumber, boolean, boolean, BigNumber, BigNumber]) {
        this.recipient = recipient;
        this.amount = amount;
        this.metadataHash = metadataHash;
        this.timeCreated = timeCreated;
        this.votingDeadline = votingDeadline;
        this.finalized = finalized;
        this.proposalPassed = proposalPassed;
        this.numberOfVotes = numberOfVotes;
        this.proposalHash = proposalHash;
    }
}

export default Proposal;