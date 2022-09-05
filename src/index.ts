import DaoInfo from "./DaoInfo";

const info = new DaoInfo();
info.init().then(async () =>
    {
        console.log(info.openProposals().map((p) => info.proposalStatus(p.idx))[4])
    }
);
