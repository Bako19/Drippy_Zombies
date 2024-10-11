"use strict";
const Web3Modal = window.Web3Modal.default;
let web3Modal;
let provider;
let selectedAccount;
let isConnected = false;
let isPrivate, isPublic

let contractAddress = "";
let abi = [
    {
        "inputs": [{
            "internalType": "uint256",
            "name": "tokenQuantity",
            "type": "uint256"
        }],
        "name": "mint",
        "outputs": [],
        "stateMutability": "payable",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "privateLive",
        "outputs": [{
            "internalType": "bool",
            "name": "",
            "type": "bool"
        }],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [{
                "internalType": "uint256",
                "name": "tokenQuantity",
                "type": "uint256"
            },
            {
                "internalType": "bytes",
                "name": "signature",
                "type": "bytes"
            },
            {
                "internalType": "uint256",
                "name": "maxMints",
                "type": "uint256"
            }
        ],
        "name": "privateMint",
        "outputs": [],
        "stateMutability": "payable",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "publicLive",
        "outputs": [{
            "internalType": "bool",
            "name": "",
            "type": "bool"
        }],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "totalSupply",
        "outputs": [{
            "internalType": "uint256",
            "name": "",
            "type": "uint256"
        }],
        "stateMutability": "view",
        "type": "function"
    }
]
async function init() {
    const providerOptions = {};
    web3Modal = new Web3Modal({
        cacheProvider: false,
        providerOptions,
        disableInjectedProvider: false,
    });
    try {
        if (window.ethereum.selectedAddress !== null) {
            connect();
        }
    } catch (error) {

    }


}
async function fetchAccountData() {
    const web3 = new Web3(provider);
    const accounts = await web3.eth.getAccounts();
    selectedAccount = accounts[0];
}

async function connect() {
    if (window.web3 == undefined && window.ethereum == undefined) {
        window
            .open("https://metamask.app.link/dapp/artificialintelligenceclub.io", "_blank")
            .focus();
    }
    provider = await web3Modal.connect();
    await fetchAccountData();

    if (isConnected) {
        return
    }

    if (selectedAccount) {
        isConnected = true;
        document.getElementById("connect-button").classList.add("d-none");
        document.getElementById("mint-Section").classList.remove("d-none");
        
        toastr.success(`Connected`);
    }
}


async function mint() {
    if (isConnected) {
        let quantity = parseInt(document.getElementById("mintQuantity").value);
        if (quantity > 0 && quantity <= 5) {
            const web3 = new Web3(provider);
            const contract = new web3.eth.Contract(abi, contractAddress);
            contract.methods.mint(quantity).send({
                from: selectedAccount,
                value: web3.utils.toWei(`${0.09 * quantity}`, "ether"),
            })
        }else{
            toastr.error(`Wrong Quantity`);
        }
    }
}

window.addEventListener("load", async () => {
    init();

})