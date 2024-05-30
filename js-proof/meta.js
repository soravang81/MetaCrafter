const NFTs = [];

function mintNFT (name , img , nickname , currency , value ) {
    let nft = {
        name,
        img,
        nickname,
        currency,
        value
    }
    NFTs.push(nft);
}

function listNFTs () {
    NFTs.forEach((nft)=>{
        console.log(
        "\n\nName : ",nft.name,
        "\nimg : ",nft.img,
        "\nnickname : ",nft.nickname,
        "\ncurrency : ",nft.currency,
        "\nvalue : ",nft.value)
    })
}


function getTotalSupply() {
    console.log("\n\nNumber of NFTs minted : " , NFTs.length+"\n\n")
}

mintNFT("Dogecoin" , "blackforest" , "dcx" , "dollar" , 100 );
mintNFT("Memecoin" , "greenforest" , "mcx" , "dollar" , 100 );
mintNFT("Mycoin" , "desert" , "mc" , "euro" , 100 );
mintNFT("Litcoin" , "lake" , "lcx" , "ruppee" , 100 );

listNFTs();

getTotalSupply();
