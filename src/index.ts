import DaoInfo from "./DaoInfo";

const info = new DaoInfo();
info.init().then(async () =>
    {
        const calldata = "0xa018f2b2000000000000000000000000c99f70bfd82fb7c8f8191fdfbfb735606b15e5c50000000000000000000000000000000000000000000000000000000000000040000000000000000000000000000000000000000000000000000000000000022468f0bcaa000000000000000000000000000000000000000000000000000000000000008000000000000000000000000000000000000000000000000000000000000000e0000000000000000000000000000000000000000000000000000000000000014000000000000000000000000000000000000000000000000000000000000001a000000000000000000000000000000000000000000000000000000000000000020000000000000000000000006b175474e89094c44da98b954eedeac495271d0f000000000000000000000000821904f826a89233be836b4de1de26b7a0eb4a67000000000000000000000000000000000000000000000000000000000000000200000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000233c8fe42703e800000000000000000000000000000000000000000000000000000000000000000002000000000000000000000000000000000000000000000000000000000000004400000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000044a9059cbb000000000000000000000000821904f826a89233be836b4de1de26b7a0eb4a6700000000000000000000000000000000000000000000d3c21bcecceda10000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000"
        console.log(await info.proposalStatus(17, calldata));
    }
);
