import DaoInfo from "./DaoInfo";

const info = new DaoInfo();
info.init().then(async () =>
    {
        console.log(info);
        const status = await info.proposalStatus(parseInt(process.argv[2]));
        console.log(status)
    }
);
