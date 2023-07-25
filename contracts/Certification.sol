// SPDX-License-Identifier: MIT

pragma solidity ^0.8.7;

contract Certification {
    address public owner;

    event ownerChanged(address indexed _prevOwner, address indexed _newOwner);
    event certificateAdded(
        string[] indexed _cid,
        string[] indexed _ipfs,
        uint256 indexed _totalCerificates
    );

    constructor() {
        owner = msg.sender;
    }

    fallback() external {}

    modifier onlyOwner() {
        require(msg.sender == owner, "You are not a owner");
        _;
    }

    function changeOwner(address _newOwner) public onlyOwner {
        owner == _newOwner;

        emit ownerChanged(owner, _newOwner);
    }

    // mapping of hashes(cid) with encrypted IPFS url
    // mapping(string => string) private certificates;

    // mapping of all the hashes
    mapping(string => bool) private certificatesValid;

    mapping(string => string[2]) public certificates;

    //

    // Read fn
    function certificateExist(string memory _cid)
        public
        view
        returns (string[2] memory)
    {
        bool exist;

        if (certificatesValid[_cid] == false) exist = false;
        else exist = true;

        require(exist == true, "Certificate does not exist");

        string[2] memory ipfsLinks = sendCertificateLink(_cid);

        return ipfsLinks;
    }

    function sendCertificateLink(string memory _cid)
        private
        view
        returns (string[2] memory)
    {
        return certificates[_cid];
    }

    // Write fn
    function addCertificate(
        string[] memory _cid,
        string[] memory _ipfsUrl1,
        string[] memory _ipfsUrl2
    ) public {
        require(
            _cid.length == _ipfsUrl1.length,
            "There is some missing fields. Check Again!"
        );

        for (uint256 i = 0; i < _cid.length; i++) {
            string memory currentCid = _cid[i];

            certificates[currentCid][0] = _ipfsUrl1[i];
            certificates[currentCid][1] = _ipfsUrl2[i];

            certificatesValid[currentCid] = true;
        }

        // emit certificateAdded(_cid, _ipfsUrl1, _cid.length);
    }
}
