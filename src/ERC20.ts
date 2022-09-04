import {ethers} from "ethers";

class ERC20 {
    public abi = [
        "function balanceOf(address owner) view returns (uint256)",
        "function decimals() view returns (uint8)",
    ];

    public contract;
    public address;
    constructor(provider : ethers.providers.Provider, address : string) {
        this.contract = new ethers.Contract(address, this.abi, provider);
        this.address = address;
    };
}
export default ERC20