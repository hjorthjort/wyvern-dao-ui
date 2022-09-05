import { BigNumber, utils } from "ethers";

type UintN = {val: BigNumber, length: number};
type MessageLike = UintN | string
type Message = string | Uint8Array

export function keccak256(... args: MessageLike[]) {
    let message : Message[] = [];
    args.forEach((m) => {
        let m1 = m as UintN;
        if (m1.val) {
            message.push(
                utils.zeroPad(utils.arrayify(m1.val.toHexString()), m1.length)
                );
        } else if (typeof m == 'string') {
            message.push(m);
        }
    })
    return utils.keccak256(utils.concat(message));
}

export default keccak256;